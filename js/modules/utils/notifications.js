/**
 * Notifications Module
 * Provides a centralized notification system with consistent styling and behavior
 */

import { notificationConfig } from '../config/appConfig.js';

class NotificationSystem {
    constructor() {
        this.activeNotifications = new Set();
        this.notificationQueue = [];
        this.isProcessingQueue = false;
    }

    /**
     * Creates or updates notification content
     * @param {HTMLElement} notification - Existing notification element or null for new
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, success, error, etc.)
     * @param {string} icon - Icon class name
     * @returns {HTMLElement} - The notification element
     */
    createOrUpdateContent(notification = null, message, type, icon) {
        const element = notification || document.createElement('div');
        element.className = `notification ${type}`;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'polite');
        
        // Add icon if provided
        const iconHtml = icon ? `<i class="${icon}" aria-hidden="true"></i> ` : '';
        element.innerHTML = `${iconHtml}${message}`;
        
        return element;
    }

    /**
     * Shows a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {string} icon - Icon class name
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} - The notification element
     */
    show(message, type = 'info', icon = '', duration = notificationConfig.duration) {
        const notification = this.createOrUpdateContent(null, message, type, icon);
        document.body.appendChild(notification);
        this.activeNotifications.add(notification);
        
        // Add to queue if there are too many active notifications
        if (this.activeNotifications.size > notificationConfig.maxNotifications) {
            this.notificationQueue.push({ notification, duration });
            this.processQueue();
            return notification;
        }
        
        if (duration > 0) {
            this.scheduleRemoval(notification, duration);
        }
        
        return notification;
    }

    /**
     * Updates an existing notification
     * @param {HTMLElement} notification - Notification element to update
     * @param {string} message - New message
     * @param {string} type - New type
     * @param {string} icon - New icon
     */
    update(notification, message, type, icon) {
        if (!this.activeNotifications.has(notification)) {
            return;
        }

        this.createOrUpdateContent(notification, message, type, icon);
        this.scheduleRemoval(notification, notificationConfig.duration);
    }

    /**
     * Processes the notification queue
     * @private
     */
    processQueue() {
        if (this.isProcessingQueue || this.notificationQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;
        const { notification, duration } = this.notificationQueue.shift();
        
        // Wait for a notification to be removed
        setTimeout(() => {
            this.isProcessingQueue = false;
            this.processQueue();
        }, duration);
    }

    /**
     * Schedules removal of a notification
     * @param {HTMLElement} notification - Notification to remove
     * @param {number} duration - Duration in milliseconds
     * @private
     */
    scheduleRemoval(notification, duration) {
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                    this.activeNotifications.delete(notification);
                }
            }, notificationConfig.fadeOutDuration);
        }, duration);
    }

    /**
     * Removes a notification immediately
     * @param {HTMLElement} notification - Notification to remove
     */
    remove(notification) {
        if (notification.parentNode) {
            document.body.removeChild(notification);
            this.activeNotifications.delete(notification);
        }
    }

    /**
     * Clears all active notifications
     */
    clearAll() {
        this.activeNotifications.forEach(notification => {
            this.remove(notification);
        });
        this.notificationQueue = [];
    }
}

// Create and export a singleton instance
const notificationSystem = new NotificationSystem();
export default notificationSystem; 