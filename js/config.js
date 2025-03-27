// Project configuration data
export const projectConfig = {
    ecosystem: {
        title: 'Ecosystem Simulation',
        overview: {
            description: 'The Ecosystem Simulation is a Java-based application that models a dynamic ecosystem with various organisms interacting in a grid-based environment. This project demonstrates complex interactions between different species, energy dynamics, and population growth patterns.',
            features: [
                'Grid-based environment with dynamic animal and plant interactions',
                'Energy-based ecosystem with predator-prey relationships',
                'Reproduction mechanics based on energy levels',
                'Configurable simulation parameters',
                'Real-time visualization using Java Swing'
            ],
            technologies: [
                'Java 17',
                'Swing UI Framework',
                'Maven for dependency management',
                'Clean Code architecture'
            ],
            instructions: [
                'Click the Demo button to launch the simulation',
                'Use controls to start, pause, and reset the simulation',
                'Adjust parameters to see different behaviors',
                'Monitor energy levels and population statistics'
            ]
        }
    },
    caesarCipher: {
        title: 'Caesar Cipher Encryption Tool',
        overview: {
            description: 'The Caesar Cipher Encryption Tool is a Java-based web application that implements the classic Caesar cipher encryption method with a modern, user-friendly interface. This project demonstrates secure file handling, encryption algorithms, and responsive web design.',
            features: [
                'File-based encryption and decryption',
                'Customizable encryption key',
                'Secure file handling',
                'Modern web interface',
                'Real-time encryption preview'
            ],
            technologies: [
                'Java 17',
                'HTML5/CSS3',
                'JavaScript',
                'RESTful API design',
                'File handling libraries'
            ],
            instructions: [
                'Upload a text file or enter text directly',
                'Choose an encryption key (shift value)',
                'Select encrypt or decrypt operation',
                'Download the processed file'
            ]
        }
    }
};

// Notification configuration
export const notificationConfig = {
    defaultDuration: 5000,
    fadeOutDuration: 500,
    types: {
        info: 'info',
        success: 'success',
        error: 'error'
    },
    icons: {
        loading: 'fas fa-spinner fa-spin',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle'
    }
};