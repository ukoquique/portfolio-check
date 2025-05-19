/**
 * Project Data Module
 * Contains structured project data and configuration
 */

/**
 * Project data organized by category
 */
export const projectData = {
    codegymProjects: [
        {
            key: "caesarCipher",
            title: "Caesar Cipher Encryption Tool",
            description: "A Java-based file encryption/decryption application implementing the Caesar cipher method with a modern web interface.",
            image: "/images/crypto.jpg",
            tags: ["Java", "Cryptography", "Web UI"],
            projectType: "webDemo",
            capabilities: {
                hasDemo: true,
                demoUrl: "/projects/caesar-cipher/index.html",
                hasCode: true,
                codeUrl: "https://github.com/HectorCorbellini/encryptor-windsurf"
            }
        },
        {
            key: "ecosystem",
            title: "Ecosystem Simulation",
            description: "A Java-based ecosystem simulation demonstrating complex interactions between animals and plants in a grid-based environment. Features include energy dynamics, reproduction mechanics, and configurable parameters.",
            image: "/images/ecosystem.png",
            tags: ["Java", "Swing UI", "Simulation"],
            projectType: "launchable",
            capabilities: {
                hasLaunch: true,
                launchHandler: "launchEcosystemSimulation",
                hasCode: true,
                codeUrl: "https://github.com/HectorCorbellini/Portfolio-windsurf-march6/tree/ecosystem-simulation-clean-code"
            }
        },
        {
            key: "codeProcessor",
            title: "Code Processor for AI",
            description: "A Python desktop application for processing code files to be shared with AI platforms. Features a drag-and-drop interface, syntax highlighting, and clipboard integration.",
            image: "/images/codeTransformer.png",
            tags: ["Python", "Desktop App", "AI Tools"],
            projectType: "launchable",
            capabilities: {
                hasLaunch: true,
                launchHandler: "launchCodeProcessor",
                hasCode: true,
                codeUrl: "https://github.com/HectorCorbellini/code-processor-py"
            }
        }
    ],
    commercialProjects: [
        {
            key: "crm",
            title: "CRM System",
            description: "Custom CRM solution for a financial services company with client management, appointment scheduling, and document processing.",
            image: "/images/crm.jpg",
            tags: ["Java", "Spring Boot", "React"],
            projectType: "showcase",
            capabilities: {
                hasCode: false
            }
        }
    ],
    teamProjects: [
        {
            key: "taskManager",
            title: "Task Management Application",
            description: "Collaborative task management tool with real-time updates, file sharing, and team communication features.",
            image: "/images/taskmanager.jpg",
            tags: ["Java", "Spring", "WebSocket"],
            projectType: "showcase",
            capabilities: {
                hasCode: false
            }
        },
        {
            key: "healthcarePortal",
            title: "Healthcare Portal",
            description: "Patient management system with appointment scheduling, medical records, and billing integration.",
            image: "/images/healthcare.jpg",
            tags: ["Java", "Hibernate", "Angular"],
            projectType: "showcase",
            capabilities: {
                hasCode: false
            }
        }
    ]
};

/**
 * Project configuration with detailed information for modals and special handling
 * This structure is aligned with the capabilities-based project data
 */
export const projectConfig = {
    // CodeGym Projects
    caesarCipher: {
        title: "Caesar Cipher Encryption Tool",
        projectType: "webDemo",
        overview: {
            description: "A Java-based file encryption/decryption application implementing the Caesar cipher method with a modern web interface.",
            features: [
                "Encrypt and decrypt text files using the Caesar cipher algorithm",
                "Configurable encryption key",
                "Support for multiple file formats",
                "Modern and intuitive web interface"
            ],
            technologies: [
                "Java",
                "HTML/CSS",
                "JavaScript",
                "File I/O"
            ],
            instructions: [
                "Upload a text file or enter text directly",
                "Choose an encryption key (shift value)",
                "Click 'Encrypt' or 'Decrypt'",
                "Download the processed file"
            ]
        }
    },
    codeProcessor: {
        title: "Code Processor for AI",
        projectType: "launchable",
        overview: {
            description: "A Python desktop application for processing code files to be shared with AI platforms. Features a drag-and-drop interface, syntax highlighting, and clipboard integration.",
            features: [
                "Drag and drop interface for easy file selection",
                "Multiple file support for batch processing",
                "Syntax highlighting for various programming languages",
                "Clipboard integration for quick copying",
                "Dark/Light mode for comfortable viewing",
                "Internationalization with English and Spanish support"
            ],
            technologies: [
                "Python",
                "CustomTkinter",
                "TkinterDnD2",
                "Pyperclip"
            ],
            instructions: [
                "Launch the application from the portfolio",
                "Drag and drop files or directories onto the drop zone",
                "Click 'Process Files' to format the code",
                "Copy the formatted code to clipboard or save to file"
            ]
        }
    },
    ecosystem: {
        title: "Ecosystem Simulation",
        projectType: "launchable",
        overview: {
            description: "A Java-based ecosystem simulation demonstrating complex interactions between animals and plants in a grid-based environment.",
            features: [
                "Real-time simulation of a complete ecosystem",
                "Multiple species with unique behaviors",
                "Energy dynamics and reproduction mechanics",
                "Configurable simulation parameters"
            ],
            technologies: [
                "Java",
                "Swing UI",
                "Object-Oriented Design",
                "Multithreading"
            ],
            instructions: [
                "Click 'Start' to begin the simulation",
                "Observe the interactions between different species",
                "Adjust simulation speed with the slider",
                "Add new organisms by selecting a type and clicking on the grid",
                "View statistics in the information panel"
            ]
        }
    },
    
    // Commercial Projects
    crm: {
        title: "CRM System",
        projectType: "showcase",
        overview: {
            description: "Custom CRM solution for a financial services company with client management, appointment scheduling, and document processing.",
            features: [
                "Client Management: Store and manage client information",
                "Appointment Scheduling: Schedule appointments and meetings",
                "Document Processing: Process and store client documents",
                "Reporting: Generate reports on client interactions",
                "Customizable: Tailored to meet the specific needs of the financial services company"
            ],
            technologies: [
                "Java",
                "Spring Boot",
                "React"
            ],
            instructions: [
                "Login to access the CRM system",
                "Navigate to the client management section",
                "Schedule an appointment or process a document"
            ]
        }
    },
    
    // Team Projects
    taskManager: {
        title: "Task Management Application",
        projectType: "showcase",
        overview: {
            description: "Collaborative task management tool with real-time updates, file sharing, and team communication features.",
            features: [
                "Task Management: Create, assign, and track tasks",
                "Real-time Updates: Receive real-time updates on task status",
                "File Sharing: Share files with team members",
                "Team Communication: Communicate with team members through chat"
            ],
            technologies: [
                "Java",
                "Spring",
                "WebSocket"
            ],
            instructions: [
                "Login to access the task management application",
                "Create a new task or assign an existing one",
                "Share a file with a team member",
                "Communicate with team members through chat"
            ]
        }
    },
    healthcarePortal: {
        title: "Healthcare Portal",
        projectType: "showcase",
        overview: {
            description: "Patient management system with appointment scheduling, medical records, and billing integration.",
            features: [
                "Patient Management: Manage patient information and interactions",
                "Appointment Scheduling: Schedule appointments and meetings",
                "Medical Records: Access and manage medical records",
                "Billing Integration: Integrate with billing systems"
            ],
            technologies: [
                "Java",
                "Hibernate",
                "Angular"
            ],
            instructions: [
                "Login to access the healthcare portal",
                "Navigate to the patient management section",
                "Schedule an appointment or access medical records"
            ]
        }
    }
};

/**
 * Notification configuration
 */
export const notificationConfig = {
    duration: 3000,
    position: 'top-right',
    types: {
        success: {
            icon: 'fas fa-check-circle',
            color: '#4CAF50'
        },
        error: {
            icon: 'fas fa-exclamation-circle',
            color: '#F44336'
        },
        info: {
            icon: 'fas fa-info-circle',
            color: '#2196F3'
        },
        warning: {
            icon: 'fas fa-exclamation-triangle',
            color: '#FF9800'
        }
    }
};

/**
 * Get all projects as a flat array
 * @returns {Array} Array of all projects
 */
export const getAllProjects = () => {
    return [
        ...projectData.codegymProjects,
        ...projectData.commercialProjects,
        ...projectData.teamProjects
    ];
};

/**
 * Get project by key
 * @param {string} key - Project key
 * @returns {Object|null} Project object or null if not found
 */
export const getProjectByKey = (key) => {
    if (!key) return null;
    
    const allProjects = getAllProjects();
    return allProjects.find(project => project.key === key) || null;
};

/**
 * Get project config by key
 * @param {string} key - Project key
 * @returns {Object|null} Project config or null if not found
 */
export const getProjectConfig = (key) => {
    if (!key || !projectConfig[key]) return null;
    return projectConfig[key];
};

/**
 * Get projects by category
 * @param {string} category - Category name (codegymProjects, commercialProjects, teamProjects)
 * @returns {Array} Array of projects in the category
 */
export const getProjectsByCategory = (category) => {
    if (!category || !projectData[category]) return [];
    return projectData[category];
};
