document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Project data
    const codegymProjects = [
        {
            title: "Task Manager",
            description: "A Java-based task management application with priority scheduling and deadline tracking.",
            image: "https://via.placeholder.com/300x200/333333/6200ea?text=Task+Manager",
            tags: ["Java", "JavaFX", "SQLite"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Weather Forecast App",
            description: "Application that fetches and displays weather data from multiple APIs with caching mechanism.",
            image: "https://via.placeholder.com/300x200/333333/6200ea?text=Weather+App",
            tags: ["Java", "Spring Boot", "REST API"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Chat Application",
            description: "Real-time chat application with private messaging and group chat functionality.",
            image: "https://via.placeholder.com/300x200/333333/6200ea?text=Chat+App",
            tags: ["Java", "WebSocket", "JavaScript"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "E-commerce Platform",
            description: "Full-featured e-commerce platform with product catalog, shopping cart, and payment processing.",
            image: "https://via.placeholder.com/300x200/333333/6200ea?text=E-commerce",
            tags: ["Java", "Spring MVC", "Hibernate", "MySQL"],
            demoLink: "#",
            codeLink: "#"
        }
    ];
    
    const commercialProjects = [
        {
            title: "Banking System",
            description: "Secure banking application with transaction management and account services.",
            image: "https://via.placeholder.com/300x200/333333/03dac6?text=Banking+System",
            tags: ["Java", "Spring Security", "PostgreSQL"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Inventory Management",
            description: "Enterprise inventory tracking system with barcode scanning and reporting features.",
            image: "https://via.placeholder.com/300x200/333333/03dac6?text=Inventory+System",
            tags: ["Java", "Spring Boot", "React", "MongoDB"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "CRM Solution",
            description: "Customer relationship management system with lead tracking and sales analytics.",
            image: "https://via.placeholder.com/300x200/333333/03dac6?text=CRM+Solution",
            tags: ["Java", "Microservices", "Docker", "Kubernetes"],
            demoLink: "#",
            codeLink: "#"
        }
    ];
    
    const teamProjects = [
        {
            title: "Eco Tracker",
            description: "Open-source application for tracking and reducing carbon footprint with community features.",
            image: "https://via.placeholder.com/300x200/333333/00c853?text=Eco+Tracker",
            tags: ["Java", "Spring Boot", "Vue.js", "PostgreSQL"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Community Aid Platform",
            description: "Platform connecting volunteers with people in need during crisis situations.",
            image: "https://via.placeholder.com/300x200/333333/00c853?text=Community+Aid",
            tags: ["Java", "Spring", "Angular", "Firebase"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Open Learning",
            description: "Educational platform providing free programming courses to underserved communities.",
            image: "https://via.placeholder.com/300x200/333333/00c853?text=Open+Learning",
            tags: ["Java", "Spring Boot", "React", "MongoDB"],
            demoLink: "#",
            codeLink: "#"
        }
    ];
    
    // Function to create project cards
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.description}</p>
                <div class="card-tags">
                    ${project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
                <div class="card-links">
                    <a href="${project.demoLink}" class="card-link"><i class="fas fa-external-link-alt"></i> Demo</a>
                    <a href="${project.codeLink}" class="card-link"><i class="fab fa-github"></i> Code</a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Populate project sections
    const projectsGrid = document.querySelector('.projects-grid');
    const commercialGrid = document.querySelector('.commercial-grid');
    const teamGrid = document.querySelector('.team-grid');
    
    codegymProjects.forEach(project => {
        projectsGrid.appendChild(createProjectCard(project));
    });
    
    commercialProjects.forEach(project => {
        commercialGrid.appendChild(createProjectCard(project));
    });
    
    teamProjects.forEach(project => {
        teamGrid.appendChild(createProjectCard(project));
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to a server
            // For now, we'll just log it to the console
            console.log('Form submission:', { name, email, subject, message });
            
            // Show success message (in a real app, this would happen after server confirmation)
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all section titles and project cards
    document.querySelectorAll('.section-title, .project-card').forEach(el => {
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
});
