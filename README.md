# Professional Java Developer Portfolio

A clean, modern, and responsive portfolio website designed to showcase Java development skills, projects, and services. This portfolio features a minimalistic dark theme design optimized for both desktop and mobile devices.

![Last Updated](https://img.shields.io/badge/Last%20Updated-April%202025-blue)
![Code Quality](https://img.shields.io/badge/Code%20Quality-Enhanced-brightgreen)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Server Configuration](#server-configuration)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)
- [Recent Improvements](#recent-improvements)

## Features

- **Minimalistic Design**: Clean, professional dark theme with strong visual appeal
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Project Showcase**: Categorized display of projects (CodeGym Academy, Commercial, Team Projects)
- **Interactive Demos**: Direct launching of applications like the Ecosystem Simulation and Code Processor
- **Project Overviews**: Modal-based detailed information about projects
- **Skills Section**: Visual representation of technical skills and expertise
- **About Me**: Professional introduction with photo
- **Contact Form**: Direct communication channel with validation and error handling
- **Social Media Integration**: Links to professional profiles
- **Smooth Animations**: Enhanced user experience with subtle animations

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Node.js with native HTTP module
- **Architecture**: Modular JavaScript with clean separation of concerns
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Roboto, Montserrat)
- **Development**: Nodemon for auto-reloading during development

## Project Structure

```
portfolio/
├── index.html          # Main HTML file with portfolio content
├── server.js           # Node.js server for local development and API endpoints
├── package.json        # Project dependencies and scripts
├── start_portfolio.sh  # Quick start script for running the portfolio
├── README.md           # Project documentation and setup guide
├── css/
│   └── styles.css      # Main stylesheet with all styling
├── js/
│   ├── main.js         # Main entry point and initialization (fully modularized)
│   └── modules/        # Modular architecture components
│       ├── business/   # Business logic modules
│       │   └── businessLogic.js # Core business functions
│       ├── ui/         # UI component modules
│       │   ├── Modal.js         # Modal component for project overviews
│       │   └── uiComponents.js  # UI creation and management
│       ├── events/     # Event handler modules
│       │   └── eventHandlers.js # Event handling functions
│       ├── data/       # Data management modules
│       │   └── projectData.js   # Project data and configuration
│       ├── config/     # Configuration modules
│       │   └── appConfig.js     # Application configuration
│       ├── services/   # Service modules
│       │   └── apiService.js    # Enhanced API service with retry logic
│       └── utils/      # Utility modules
│           ├── errorHandler.js  # Client-side error handling
│           ├── notifications.js # Notification system
│           ├── accessibility.js # Accessibility features
│           └── lazyLoading.js   # Image lazy loading
├── images/             # Project and profile images
├── server/             # Server-side code
│   ├── config.js       # Server configuration
│   ├── router.js       # API routing with Promise-based handlers
│   └── utils/          # Server utilities
│       ├── errorHandler.js # Enhanced error handling with custom error types
│       └── logger.js   # Structured logging system
└── projects/           # Project-specific files and launch scripts
    ├── ecosystem-simulation/  # Ecosystem Simulation project files
    │   └── launch.js   # Server-side script to launch the Java application
    └── caesar-cipher/  # Caesar Cipher project files
        ├── index.html  # Caesar Cipher web interface
        └── start_cipher.sh # Script to launch Caesar Cipher
```

## Setup and Installation

1. **Prerequisites**
   - Node.js version 14.x or higher
   - npm version 6.x or higher
   - To check your versions, run:
   ```bash
   node --version
   npm --version
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/HectorCorbellini/Portfolio-windsurf-march6.git
   cd Portfolio-windsurf-march6
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

3. **Make the start script executable**
   ```bash
   chmod +x start_portfolio.sh
   ```

4. **Start the development server**
   ```bash
   npm run start
   ```
   Or use the quick start script:
   ```bash
   ./start_portfolio.sh
   ```

5. **Access the portfolio**
   Open your browser and navigate to:
   ```
   http://localhost:3001/
   ```

6. **Development mode with auto-reload**
   ```bash
   npm run dev
   ```
   This mode automatically reloads the server when you make changes to your files. 
   It's recommended for development only, not for production use.

## Server Configuration

The portfolio uses a simple Node.js server with the following configuration options in `server/config.js`:

- **Port**: Default is 3001, can be changed in the config file or via environment variables
- **Host**: Default is 'localhost', configurable via environment variables
- **Environment**: Development or production mode (NODE_ENV)
- **Caching**: Enabled in production mode, disabled in development
- **MIME Types**: Configured for all common web file types
- **Error Handling**: Comprehensive error handling with custom error types
- **Logging**: Structured logging with different levels based on environment for various file extensions
- **Fallback to Index**: Routes unknown paths back to index.html
- **API Endpoints**: Handles requests to launch applications like the Ecosystem Simulation
- **Process Management**: Executes and manages external applications
- **Error Handling**: Comprehensive error handling with custom error classes

To change the port, set the PORT environment variable before starting the server:

```bash
PORT=8080 npm run start
```

## Customization

### Personal Information

Edit the following sections in `index.html`:

1. Update the `<title>` tag with your name
2. Modify the hero section content with your profession and location
3. Edit the About Me section with your personal information
4. Update the contact information and social media links
5. Replace the profile image at `/assets/images/profile.svg`

### Projects

Project data is now stored in the `js/modules/data/projectData.js` file. Modify the following sections to add your own projects:

- `projectData.codegymProjects`: CodeGym Academy projects
- `projectData.commercialProjects`: Commercial applications
- `projectData.teamProjects`: Team and open-source projects

Each project object should include:
```javascript
{
  key: "uniqueProjectKey", // Unique identifier for the project
  title: "Project Name",
  description: "Brief project description",
  image: "/images/project-image.jpg",
  tags: ["Java", "Spring", "MySQL"],
  demoLink: "https://demo-link.com", // Use null for projects with custom launch functionality
  codeLink: "https://github.com/username/repo"
}
```

For detailed project configuration, add an entry to the `projectConfig` object:
```javascript
projectConfig: {
  uniqueProjectKey: {
    title: "Project Name",
    overview: {
      description: "Detailed project description",
      features: ["Feature 1", "Feature 2"],
      technologies: ["Technology 1", "Technology 2"],
      instructions: ["Instruction 1", "Instruction 2"]
    }
  }
}
```

### Interactive Applications

The portfolio supports launching various applications directly from the browser:

1. **Create a launch script**: Add a server-side script in the project directory (e.g., `projects/code-processor/launch.js`)
2. **Update server.js**: Add an API endpoint to handle the launch request
3. **Configure the project**: Set `demoLink` to `null`, add a `launchHandler` property, and ensure the feature flag is enabled in `appConfig.js`
4. **Register the handler**: Add the handler function to the handler registry in the `initProjects` function in `main.js`

Currently implemented interactive applications:
- **Ecosystem Simulation**: Java-based ecosystem simulation
- **Code Processor**: Python desktop application for processing code files

### Styling

The color scheme can be modified in the `:root` section of `styles.css`. The current theme uses:

```css
:root {
  --primary-color: #6200ea;
  --secondary-color: #03dac6;
  --bg-dark: #121212;
  --bg-darker: #0a0a0a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --card-bg: #1e1e1e;
}
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - The default port is 3001. If it's already in use, you can change it in `server/config.js`
   - The `start_portfolio.sh` script automatically attempts to kill processes using port 3001
   - Alternatively, kill the process manually: `npx kill-port 3001`

2. **Dependencies issues**
   - If you encounter dependency issues, try: `npm clean-cache && npm install`
   - The `start_portfolio.sh` script automatically installs dependencies if needed
   ```

3. **Images Not Displaying**
   - Check file paths and extensions (use browser dev tools to see errors)
   - Ensure image files exist in the correct location
   - Verify file format matches extension (PNG files should have .png extension)
   - Use absolute paths starting with `/images/...`

4. **CSS Not Applying**
   - Clear browser cache with hard refresh (Ctrl+F5)
   - Check for CSS syntax errors in browser dev tools
   - Verify CSS file is being loaded (check network tab in dev tools)

5. **JavaScript Not Working**
   - Check browser console for errors (F12 > Console tab)
   - Ensure script tags are properly placed in HTML
   - Verify event listeners are attached to existing elements
   - Check for module import/export errors

## Browser Compatibility

This portfolio is designed to work on all modern browsers including:
- Chrome (v120+)
- Firefox (v122+)
- Safari (v17+)
- Edge (v122+)

## Recent Improvements

### Performance Optimizations (April 2025)
- **Shared Observer Pattern**: Implemented shared IntersectionObserver instances for better memory usage and performance
- **Optimized Image Loading**: Enhanced lazy loading with preloading, proper placeholders, and native browser support
- **Non-Blocking UI**: Implemented batch processing and incremental rendering to prevent main thread blocking
- **Memory Management**: Added proper cleanup of data attributes and references to reduce memory usage
- **Efficient DOM Operations**: Used DocumentFragment and optimized loops for better rendering performance
- **Animation Optimization**: Leveraged requestAnimationFrame for smoother animations and better visual performance
- **Reduced Layout Thrashing**: Minimized layout recalculations by batching read/write operations
- **Cached Computations**: Added caching for frequently used values and placeholder images

### Error Handling Bridge System (April 2025)
- **Unified Error Handling**: Created a consistent error handling approach across server and client sides
- **Error Bridge Module**: Implemented a bridge to translate server errors to client-side format
- **Enhanced Error Responses**: Added structured error responses with improved user feedback
- **Standardized Error Objects**: Created consistent error object structure with timestamps and severity levels
- **Improved Error Pages**: Enhanced error pages with better styling and user experience
- **Structured Error Logging**: Implemented detailed error logging with appropriate severity levels

### Clean Code Refactoring (April 2025)
- **Function Decomposition**: Refactored large functions into smaller, focused ones with single responsibilities
- **Enhanced Error Handling**: Implemented consistent error handling with custom error types and detailed context
- **Improved API Service**: Added retry logic, better error categorization, and enhanced response handling
- **Promise-Based Execution**: Replaced callback-based code with Promise-based alternatives for better async flow
- **Redundancy Removal**: Eliminated duplicate files, consolidated image directories, and removed unused code
- **Optimized Imports**: Removed global imports in favor of local imports where needed

### Comprehensive Modular Architecture
- **UI Components Module**: Extracted UI-related functions for better organization
- **Event Handlers Module**: Centralized event handling logic with improved error handling
- **Project Data Module**: Created a dedicated module for project data management
- **API Service Module**: Enhanced error handling with timeout management and form validation
- **Direct Module Imports**: Removed compatibility wrappers for a cleaner codebase
- **Configuration Module**: Centralized all application settings in one place
- **Feature Flag System**: Implemented consistent feature flag checks throughout the codebase

### Code Quality Enhancements
- Implemented Clean Code principles throughout the project
- Enhanced error handling with detailed error messages
- Improved form validation with comprehensive email validation
- Added proper documentation with JSDoc comments
- Maintained backward compatibility while transitioning to the new architecture

### Server-Side Improvements
- Enhanced start_portfolio.sh script with better error handling and dependency management
- Removed redundant imports from server.js
- Improved serveStaticFile function with enhanced logging and error handling
- Added proper error handling for API endpoints
- Implemented structured logging with different severity levels

## License

MIT License. See LICENSE file for details.
