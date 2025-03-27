import { notificationConfig } from './config.js';

class NotificationSystem {
    constructor() {
        this.activeNotifications = new Set();
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
        element.innerHTML = icon ? `<i class="${icon}"></i> ${message}` : message;
        return element;
    }

    show(message, type = notificationConfig.types.info, icon = '', duration = notificationConfig.defaultDuration) {
        const notification = this.createOrUpdateContent(null, message, type, icon);
        document.body.appendChild(notification);
        this.activeNotifications.add(notification);
        
        if (duration > 0) {
            this.scheduleRemoval(notification, duration);
        }
        
        return notification;
    }

    update(notification, message, type, icon) {
        if (!this.activeNotifications.has(notification)) {
            return;
        }

        this.createOrUpdateContent(notification, message, type, icon);
        this.scheduleRemoval(notification, notificationConfig.defaultDuration);
    }

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

    remove(notification) {
        if (notification.parentNode) {
            document.body.removeChild(notification);
            this.activeNotifications.delete(notification);
        }
    }
}

// Create and export a singleton instance
const notificationSystem = new NotificationSystem();
export default notificationSystem;