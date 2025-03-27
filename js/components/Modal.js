export class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        this.modal = null;
    }

    open() {
        // Create the modal if it doesn't exist
        if (!this.modal) {
            this.create();
        }
        
        // Add the modal to the DOM
        document.body.appendChild(this.modal);
        
        // Add 'active' class after a small delay for animation
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
    }

    create() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                    <button class="close-btn">&times;</button>
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
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        
        document.addEventListener('keydown', escHandler);
    }

    close() {
        if (this.modal) {
            // Add fade-out animation
            this.modal.classList.remove('active');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    document.body.removeChild(this.modal);
                }
                this.modal = null;
            }, 300);
        }
    }
}