/**
 * Project data for the portfolio
 * Centralizes all project information in one place
 */
export const projectData = {
    codegymProjects: [
        {
            title: "Caesar Cipher Encryption Tool",
            description: "A Java-based file encryption/decryption application implementing the Caesar cipher method with a modern web interface.",
            image: "/images/crypto.jpg",
            tags: ["Java", "Cryptography", "Web UI"],
            demoLink: "/projects/caesar-cipher/index.html",
            codeLink: "https://github.com/HectorCorbellini/encryptor-windsurf"
        },
        {
            title: "Ecosystem Simulation",
            description: "A Java-based ecosystem simulation demonstrating complex interactions between animals and plants in a grid-based environment. Features include energy dynamics, reproduction mechanics, and configurable parameters.",
            image: "/images/ecosystem.png",
            tags: ["Java", "Swing UI", "Simulation"],
            demoLink: "#",
            overview: {
                features: [
                    "Grid-based environment with dynamic animal and plant interactions",
                    "Energy-based ecosystem with predator-prey relationships",
                    "Reproduction mechanics based on energy levels",
                    "Configurable simulation parameters",
                    "Real-time visualization using Java Swing"
                ],
                technologies: [
                    "Java 17",
                    "Swing UI Framework",
                    "Maven for dependency management",
                    "Clean Code architecture"
                ],
                instructions: [
                    "Click the Demo button to launch the simulation",
                    "Use controls to start, pause, and reset the simulation",
                    "Adjust parameters to see different behaviors",
                    "Monitor energy levels and population statistics"
                ]
            },
            codeLink: "https://github.com/HectorCorbellini/Portfolio-windsurf-march6/tree/ecosystem-simulation-clean-code"
        },
        {
            title: "E-commerce Platform",
            description: "Full-featured e-commerce platform with product catalog, shopping cart, and payment processing.",
            image: "/images/ecommerce.jpg",
            tags: ["Java", "Spring MVC", "Hibernate"],
            demoLink: "#",
            codeLink: "#"
        }
    ],
    commercialProjects: [
        {
            title: "CRM System",
            description: "Custom CRM solution for a financial services company with client management, appointment scheduling, and document processing.",
            image: "/images/crm.jpg",
            tags: ["Java", "Spring Boot", "React"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Inventory Management System",
            description: "Real-time inventory tracking system with barcode scanning, reporting, and supplier integration.",
            image: "/images/inventory.jpg",
            tags: ["Java", "MySQL", "REST API"],
            demoLink: "#",
            codeLink: "#"
        }
    ],
    teamProjects: [
        {
            title: "Task Management Application",
            description: "Collaborative task management tool with real-time updates, file sharing, and team communication features.",
            image: "/images/taskmanager.jpg",
            tags: ["Java", "Spring", "WebSocket"],
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Healthcare Portal",
            description: "Patient management system with appointment scheduling, medical records, and billing integration.",
            image: "/images/healthcare.jpg",
            tags: ["Java", "Hibernate", "Angular"],
            demoLink: "#",
            codeLink: "#"
        }
    ]
};

/**
 * Project configuration for detailed overviews
 */
export const projectConfig = {
    ecosystem: {
        title: "Ecosystem Simulation",
        overview: {
            description: "A Java-based ecosystem simulation demonstrating complex interactions between animals and plants in a grid-based environment. Features include energy dynamics, reproduction mechanics, and configurable parameters.",
            features: [
                "Grid-based environment with dynamic animal and plant interactions",
                "Energy-based ecosystem with predator-prey relationships",
                "Reproduction mechanics based on energy levels",
                "Configurable simulation parameters",
                "Real-time visualization using Java Swing"
            ],
            technologies: [
                "Java 17",
                "Swing UI Framework",
                "Maven for dependency management",
                "Clean Code architecture"
            ],
            instructions: [
                "Click the Demo button to launch the simulation",
                "Use controls to start, pause, and reset the simulation",
                "Adjust parameters to see different behaviors",
                "Monitor energy levels and population statistics"
            ]
        }
    },
    caesarCipher: {
        title: "Caesar Cipher Encryption Tool",
        overview: {
            description: "A Java-based file encryption/decryption application implementing the Caesar cipher method with a modern web interface.",
            features: [
                "File-based encryption and decryption",
                "Customizable encryption key",
                "Support for text and binary files",
                "Modern web interface"
            ],
            technologies: [
                "Java 17",
                "HTML/CSS/JavaScript",
                "RESTful API",
                "Cryptography libraries"
            ],
            instructions: [
                "Upload a file to encrypt or decrypt",
                "Set your encryption key (1-25)",
                "Click Encrypt or Decrypt",
                "Download the processed file"
            ]
        }
    }
};
