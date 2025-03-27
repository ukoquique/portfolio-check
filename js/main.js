import { projectConfig } from './config.js';
import notificationSystem from './notifications.js';
import { Modal } from './components/Modal.js';
import { projectData } from './data/projects.js';
import apiService from './services/api.js';

// ===== Business Logic =====
const businessLogic = {
    /**
     * Generate project overview content
     * @param {string} projectKey - Key of the project in projectConfig
     * @returns {string} HTML content for the modal
     */
    generateProjectOverview(projectKey) {
        const project = projectConfig[projectKey];
        return `
            <div class="overview-section description-section">
                <h3>Project Overview</h3>
                <p>${project.overview.description}</p>
            </div>
            
            <div class="overview-section features-section">
                <h3>Key Features</h3>
                <ul>
                    ${project.overview.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="overview-section tech-section">
                <h3>Technologies Used</h3>
                <ul>
                    ${project.overview.technologies.map(tech => `<li>${tech}</li>`).join('')}
                </ul>
            </div>
            
            <div class="overview-section instructions-section">
                <h3>How to Use</h3>
                <ol>
                    ${project.overview.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
        `;
    },
    
    /**
     * Process form submission
     * @param {Object} formData - Form data object
     * @returns {Promise} Promise resolving to success or error message
     */
    submitContactForm(formData) {
        return apiService.submitContactForm(formData)
            .then(response => response.message);
    },
    
    /**
     * Launch the ecosystem simulation
     * @returns {Promise} Promise resolving to API response
     */
    launchEcosystemSimulation() {
        return apiService.launchEcosystemSimulation();
    }
};

// ===== UI Components =====
const uiComponents = {
    /**
     * Creates a DOM element with specified attributes
     * @param {string} tag - HTML tag name
     * @param {Object} options - Element options
     * @returns {HTMLElement} - The created element
     */
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        if (options.className) element.className = options.className;
        if (options.textContent) element.textContent = options.textContent;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        return element;
    },
    
    /**
     * Creates a card link or button element
     * @param {Object} options - Link options
     * @returns {HTMLElement} - The created link or button
     */
    createCardLink({ href, onClick, icon, text, isButton }) {
        const linkElement = isButton 
            ? this.createElement('button', { className: 'card-link' })
            : this.createElement('a', { 
                className: 'card-link',
                attributes: { href, target: '_blank', rel: 'noopener noreferrer' }
            });
        
        if (onClick && isButton) {
            linkElement.addEventListener('click', onClick);
        }
        
        const iconElement = this.createElement('i', { className: icon });
        linkElement.appendChild(iconElement);
        linkElement.appendChild(document.createTextNode(' ' + text));
        
        return linkElement;
    },
    
    /**
     * Creates the image element for a project card
     * @param {Object} project - Project data object
     * @returns {HTMLElement} - The image container element
     */
    createCardImage(project) {
        const imageContainer = this.createElement('div', { className: 'card-image' });
        const image = this.createElement('img', { 
            attributes: { 
                src: project.image,
                alt: project.title,
                loading: 'lazy'
            }
        });
        imageContainer.appendChild(image);
        return imageContainer;
    },
    
    /**
     * Creates the content section for a project card
     * @param {Object} project - Project data object
     * @returns {HTMLElement} - The content container element
     */
    createCardContent(project) {
        const content = this.createElement('div', { className: 'card-content' });
        
        // Title
        const title = this.createElement('h3', { className: 'card-title', textContent: project.title });
        content.appendChild(title);
        
        // Description
        const description = this.createElement('p', { className: 'card-description', textContent: project.description });
        content.appendChild(description);
        
        // Tags
        const tags = this.createElement('div', { className: 'card-tags' });
        project.tags.forEach(tag => {
            const tagElement = this.createElement('span', { className: 'tag', textContent: tag });
            tags.appendChild(tagElement);
        });
        content.appendChild(tags);
        
        // Links
        const links = this.createElement('div', { className: 'card-links' });
        
        // Demo link or button
        if (project.demoLink === '#' && project.title === 'Ecosystem Simulation') {
            links.appendChild(this.createCardLink({
                onClick: () => eventHandlers.handleSimulationLaunch(),
                icon: 'fas fa-play-circle',
                text: 'Launch Demo',
                isButton: true
            }));
            
            links.appendChild(this.createCardLink({
                onClick: () => eventHandlers.handleProjectOverview('ecosystem'),
                icon: 'fas fa-info-circle',
                text: 'Overview',
                isButton: true
            }));
        } else if (project.demoLink === '#') {
            links.appendChild(this.createCardLink({
                href: project.demoLink,
                icon: 'fas fa-play-circle',
                text: 'Demo Coming Soon',
                isButton: false
            }));
        } else if (project.title === 'Caesar Cipher Encryption Tool') {
            links.appendChild(this.createCardLink({
                href: project.demoLink,
                icon: 'fas fa-play-circle',
                text: 'Try Demo',
                isButton: false
            }));
            
            links.appendChild(this.createCardLink({
                onClick: () => eventHandlers.handleProjectOverview('caesarCipher'),
                icon: 'fas fa-info-circle',
                text: 'Overview',
                isButton: true
            }));
        } else {
            links.appendChild(this.createCardLink({
                href: project.demoLink,
                icon: 'fas fa-play-circle',
                text: 'Try Demo',
                isButton: false
            }));
        }
        
        // Code link
        if (project.codeLink !== '#') {
            links.appendChild(this.createCardLink({
                href: project.codeLink,
                icon: 'fab fa-github',
                text: 'View Code',
                isButton: false
            }));
        }
        
        content.appendChild(links);
        return content;
    },
    
    /**
     * Creates a complete project card
     * @param {Object} project - Project data object
     * @returns {HTMLElement} - The complete project card
     */
    createProjectCard(project) {
        const card = this.createElement('div', { className: 'project-card' });
        card.appendChild(this.createCardImage(project));
        card.appendChild(this.createCardContent(project));
        return card;
    },
    
    /**
     * Populates a grid container with project cards
     * @param {HTMLElement} container - Grid container element
     * @param {Array} projects - Array of project data objects
     */
    populateProjectGrid(container, projects) {
        if (!container) return;
        
        projects.forEach(project => {
            container.appendChild(this.createProjectCard(project));
        });
    },
    
    /**
     * Setup animation for elements
     * @param {NodeList} elements - Elements to animate
     */
    setupAnimations(elements) {
        const observerOptions = { threshold: 0.1 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
        
        // Add fade-in class for animation
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .fade-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            </style>
        `);
    }
};

// ===== Event Handlers =====
const eventHandlers = {
    /**
     * Handle project overview display
     * @param {string} projectKey - Project key
     */
    handleProjectOverview(projectKey) {
        const content = businessLogic.generateProjectOverview(projectKey);
        const modal = new Modal(projectConfig[projectKey].title, content);
        modal.open();
    },
    
    /**
     * Handle ecosystem simulation launch
     */
    handleSimulationLaunch() {
        const notification = notificationSystem.show(
            'Launching simulation...',
            'info',
            'fas fa-spinner fa-spin'
        );
        
        businessLogic.launchEcosystemSimulation()
            .then(data => {
                notificationSystem.update(
                    notification,
                    data.message || 'Simulation launched successfully',
                    'success',
                    'fas fa-check-circle'
                );
            })
            .catch(error => {
                console.error('Error:', error);
                notificationSystem.update(
                    notification, 
                    'Error launching simulation', 
                    'error', 
                    'fas fa-exclamation-circle'
                );
            });
    },
    
    /**
     * Handle mobile menu toggle
     * @param {Object} elements - DOM elements
     */
    handleMobileMenuToggle(elements) {
        if (elements.hamburger && elements.navLinks) {
            elements.hamburger.addEventListener('click', () => {
                elements.hamburger.classList.toggle('active');
                elements.navLinks.classList.toggle('active');
            });
        }
    },
    
    /**
     * Handle mobile menu link clicks
     * @param {Object} elements - DOM elements
     */
    handleMobileMenuLinks(elements) {
        elements.navLinksAnchors.forEach(link => {
            link.addEventListener('click', () => {
                if (elements.hamburger && elements.navLinks) {
                    elements.hamburger.classList.remove('active');
                    elements.navLinks.classList.remove('active');
                }
            });
        });
    },
    
    /**
     * Handle smooth scrolling
     * @param {NodeList} anchors - Anchor elements
     */
    handleSmoothScrolling(anchors) {
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    /**
     * Handle contact form submission
     * @param {HTMLElement} form - Contact form element
     * @param {Object} formElements - Form input elements
     */
    handleContactForm(form, formElements) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: formElements.name.value,
                email: formElements.email.value,
                subject: formElements.subject.value,
                message: formElements.message.value
            };
            
            businessLogic.submitContactForm(formData)
                .then(message => {
                    notificationSystem.show(
                        message,
                        'success',
                        'fas fa-check-circle'
                    );
                    form.reset();
                })
                .catch(error => {
                    notificationSystem.show(
                        `Error: ${error.message}`,
                        'error',
                        'fas fa-exclamation-circle'
                    );
                });
        });
    }
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const domElements = {
        currentYear: document.getElementById('current-year'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        navLinksAnchors: document.querySelectorAll('.nav-links a'),
        anchors: document.querySelectorAll('a[href^="#"]'),
        projectsGrid: document.querySelector('.projects-grid'),
        commercialGrid: document.querySelector('.commercial-grid'),
        teamGrid: document.querySelector('.team-grid'),
        contactForm: document.getElementById('contactForm'),
        animatedElements: document.querySelectorAll('.section-title, .project-card')
    };
    
    // Initialize all components
    initFooter(domElements);
    initNavigation(domElements);
    initProjects(domElements);
    initContactForm(domElements);
    initAnimations(domElements);
});

/**
 * Initialize footer content
 * @param {Object} domElements - Cached DOM elements
 */
function initFooter(domElements) {
    if (domElements.currentYear) {
        domElements.currentYear.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize navigation components
 * @param {Object} domElements - Cached DOM elements
 */
function initNavigation(domElements) {
    // Mobile menu toggle
    eventHandlers.handleMobileMenuToggle(domElements);
    eventHandlers.handleMobileMenuLinks(domElements);
    
    // Smooth scrolling
    initSmoothScroll(domElements.anchors);
}

/**
 * Initialize smooth scrolling for anchor links
 * @param {NodeList} anchors - Anchor elements
 */
function initSmoothScroll(anchors) {
    eventHandlers.handleSmoothScrolling(anchors);
}

/**
 * Initialize project sections
 * @param {Object} domElements - Cached DOM elements
 */
function initProjects(domElements) {
    // Populate project grids
    uiComponents.populateProjectGrid(domElements.projectsGrid, projectData.codegymProjects);
    uiComponents.populateProjectGrid(domElements.commercialGrid, projectData.commercialProjects);
    uiComponents.populateProjectGrid(domElements.teamGrid, projectData.teamProjects);
}

/**
 * Initialize contact form
 * @param {Object} domElements - Cached DOM elements
 */
function initContactForm(domElements) {
    if (domElements.contactForm) {
        const formElements = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message')
        };
        
        eventHandlers.handleContactForm(domElements.contactForm, formElements);
    }
}

/**
 * Initialize animations
 * @param {Object} domElements - Cached DOM elements
 */
function initAnimations(domElements) {
    uiComponents.setupAnimations(domElements.animatedElements);
}

// For backward compatibility
const showEcosystemOverview = () => eventHandlers.handleProjectOverview('ecosystem');
const showCaesarCipherOverview = () => eventHandlers.handleProjectOverview('caesarCipher');
const launchSimulation = () => eventHandlers.handleSimulationLaunch();
