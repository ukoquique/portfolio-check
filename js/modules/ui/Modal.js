export class Modal {
    constructor(options) {
        // Support both old and new constructor formats
        if (typeof options === 'string' || options.title) {
            this.title = typeof options === 'string' ? options : options.title;
            this.content = arguments[1] || options.content;
            this.onOpen = options.onOpen || null;
            this.onClose = options.onClose || null;
        } else {
            this.title = '';
            this.content = '';
            this.onOpen = null;
            this.onClose = null;
        }
        
        this.modal = null;
        this.element = null; // Reference to the modal element for external access
        this.escHandler = null; // Store handler for cleanup
    }

    open() {
        // Create the modal if it doesn't exist
        if (!this.modal) {
            this.create();
        }
        
        // Add the modal to the DOM
        document.body.appendChild(this.modal);
        this.element = this.modal; // Set element reference
        
        // Add 'active' class after a small delay for animation
        setTimeout(() => {
            this.modal.classList.add('active');
            
            // Call onOpen callback if provided
            if (typeof this.onOpen === 'function') {
                this.onOpen();
            }
        }, 10);
    }

    create() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.setAttribute('aria-labelledby', 'modal-title');
        
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title">${this.title}</h2>
                    <button class="close-btn" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.content}
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        // Close button click
        this.modal.querySelector('.close-btn').addEventListener('click', () => this.close());
        
        // Outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Escape key
        this.escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        
        document.addEventListener('keydown', this.escHandler);
    }

    close() {
        if (this.modal) {
            // Call onClose callback if provided
            if (typeof this.onClose === 'function') {
                this.onClose();
            }
            
            // Remove event listeners
            if (this.escHandler) {
                document.removeEventListener('keydown', this.escHandler);
                this.escHandler = null;
            }
            
            // Add fade-out animation
            this.modal.classList.remove('active');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    document.body.removeChild(this.modal);
                }
                this.modal = null;
                this.element = null;
            }, 300);
        }
    }
}