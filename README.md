# Professional Java Developer Portfolio

A clean, modern, and responsive portfolio website designed to showcase Java development skills, projects, and services. This portfolio features a minimalistic dark theme design optimized for both desktop and mobile devices.

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
- **Interactive Demos**: Direct launching of applications like the Ecosystem Simulation and Caesar Cipher
- **Project Overviews**: Modal-based detailed information about projects
- **Skills Section**: Visual representation of technical skills and expertise
- **About Me**: Professional introduction with photo
- **Contact Form**: Direct communication channel for potential clients
- **Social Media Integration**: Links to professional profiles
- **Smooth Animations**: Enhanced user experience with subtle animations

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Node.js with native HTTP module
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
│   └── main.js         # JavaScript for interactive functionality
├── assets/             # Assets directory containing images and other resources
│   └── images/         # Profile and other images
├── images/             # Project images
└── projects/           # Project-specific files and launch scripts
    └── ecosystem-simulation/  # Ecosystem Simulation project files
        └── launch.js   # Server-side script to launch the Java application
```

## Setup and Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Make the start script executable**
   ```bash
   chmod +x start_portfolio.sh
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```
   Or use the quick start script:
   ```bash
   ./start_portfolio.sh
   ```

4. **Access the portfolio**
   Open your browser and navigate to:
   ```
   http://localhost:3001/
   ```

5. **Development mode with auto-reload**
   ```bash
   npm run dev
   ```
   This mode automatically reloads the server when you make changes to your files. 
   It's recommended for development only, not for production use.

## Server Configuration

The project uses a Node.js server (server.js) with these key features:

- **Port Configuration**: Default port is 3001 (configurable via PORT environment variable)
- **Static File Serving**: Automatically serves HTML, CSS, JS, and image files
- **MIME Type Support**: Properly sets content types for various file extensions
- **Fallback to Index**: Routes unknown paths back to index.html
- **API Endpoints**: Handles requests to launch applications like the Ecosystem Simulation
- **Process Management**: Executes and manages external applications

To change the default port, set the PORT environment variable when running the server:
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

Project data is stored in the `main.js` file. Modify the following arrays to add your own projects:

- `codegymProjects`: CodeGym Academy projects
- `commercialProjects`: Commercial applications
- `teamProjects`: Team and open-source projects

Each project object should include:
```javascript
{
  title: "Project Name",
  description: "Brief project description",
  image: "/images/project-image.jpg",
  tags: ["Java", "Spring", "MySQL"],
  demoLink: "https://demo-link.com", // Use '#' for projects with custom launch functionality
  codeLink: "https://github.com/username/repo",
  // Optional: For projects with detailed overviews
  overview: {
    features: ["Feature 1", "Feature 2"],
    technologies: ["Technology 1", "Technology 2"],
    instructions: ["Instruction 1", "Instruction 2"]
  }
}
```

### Interactive Applications

The portfolio supports launching Java applications directly from the browser:

1. **Create a launch script**: Add a server-side script in the project directory
2. **Update server.js**: Add an API endpoint to handle the launch request
3. **Configure the project**: Set `demoLink` to `#` and add a click handler for the Demo button

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

1. **Start Script Permission Issues**
   - Error: `Permission denied` when running `./start_portfolio.sh`
   - Solution: Make the script executable with:
   ```bash
   chmod +x start_portfolio.sh
   ```

2. **Server Port Conflict**
   - Error: `EADDRINUSE: address already in use :::3001`
   - Solution: Change the port using environment variable or kill the process using the port
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill the process
   kill -9 [PID]
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

## Browser Compatibility

This portfolio is designed to work on all modern browsers including:
- Chrome (v120+)
- Firefox (v122+)
- Safari (v17+)
- Edge (v122+)

## Recent Improvements

### Code Refactoring
- The codebase has been refactored to improve organization and reduce redundancy. Utility functions have been created for modal and notification handling.

### Standardized Image Paths
- All project images now use standardized relative paths from the `/images` directory instead of placeholder URLs.

### Enhanced Error Handling
- Improved error handling in the server to provide better logging and structured error responses for API endpoints.

### Updated Project Structure
- The project structure has been updated to reflect the new organization, including the addition of images in the `/images` directory.

## License

This project is available under the MIT License. See the LICENSE file for details.

---

Created by Héctor Corbellini for showcasing Java development skills and services.

Last updated: March 2024
