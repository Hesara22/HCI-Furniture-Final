Furniture Design App
A desktop application for designing furniture layouts in 2D and 3D, built with React.js, Three.js, and Tailwind CSS for the PUSL3122 coursework. This app allows users to create, customize, and visualize room layouts with chairs and tables, featuring a modern, user-friendly interface and interactive controls.
Table of Contents

Features
Screenshots
Installation
Usage
Technologies
Resources
Credits
License

Features

Designer Login: Simple username/password authentication to access the design studio.
Room Customization: Adjust room dimensions (width, height, depth) and wall color with realistic brick wall and hardwood floor textures.
Furniture Placement: Add chairs and tables, positioned on the floor with automatic x-offset to avoid overlap. Drag-and-drop furniture with optional grid snapping for precise alignment.
Interactive Visualization: Switch between 2D (top-down) and 3D (orbit controls) views. Features a floor grid in 3D for spatial context and bright lighting for vibrant visuals.
Modern UI/UX: Glassmorphism panels, gradient backgrounds, collapsible control sections, tooltips, and confirmation dialogs for an intuitive experience.
Design Management: Save designs to local storage, edit existing designs, or delete them with confirmation prompts.
Responsive Design: Optimized for various screen sizes, including laptops (e.g., 1280x720).

Screenshots



Login Screen
Design Studio
3D View with Grid Snapping








Note: Replace screenshots/*.png with actual images captured during testing.
Installation

Clone the Repository:
git clone https://github.com/your-username/furniture-design-app.git
cd furniture-design-app


Install Dependencies:Ensure Node.js (v16 or higher) is installed. Then run:
npm install


Set Up Textures:Place the following texture files in public/textures/:

brick_wall_02_diff_1k.jpg
wooden_floor_02_diff_1k.jpg
wood_025_diff_1k.jpgDownload from Poly Haven (CC0 license).


Configure Tailwind CSS:Ensure tailwind.config.js includes:
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

Add Inter font to public/index.html:
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />


Start the App:
npm start

The app will run at http://localhost:3000.


Usage

Log In: Enter any username and password to access the design studio.
Customize Room: Adjust width, height, depth, and wall color in the "Room Settings" section.
Add Furniture: Use "Add Furniture" to place chairs or tables, which spawn on the floor with offset x-positions.
Arrange Furniture: Drag furniture in 3D view (click, move, release). Enable "Snap to Grid" (top-right toggle) for precise alignment.
Adjust Settings: Modify furniture position, scale, color, and shininess in "Furniture Settings". Use tooltips for guidance.
Switch Views: Toggle between 2D (top-down) and 3D (orbit controls) in "View Mode".
Manage Designs: Save designs, edit existing ones, or delete with confirmation dialogs in "Saved Designs".
Test Responsiveness: Resize the browser to ensure the UI adapts to smaller screens.

For a video demonstration, see YouTube Link (replace with actual link after upload).
Technologies

React.js: Frontend framework for building the UI.
Three.js: 3D rendering for room and furniture visualization.
React Three Fiber: React renderer for Three.js.
Tailwind CSS: Utility-first CSS for modern, responsive styling.
Inter Font: Clean typography for enhanced readability.

Resources

React.js: https://reactjs.org/
Three.js: https://threejs.org/
React Three Fiber: https://docs.pmnd.rs/react-three-fiber/
Tailwind CSS: https://tailwindcss.com/
Inter Font: https://fonts.google.com/specimen/Inter
Textures: Poly Haven (CC0) - brick_wall_02, wooden_floor_02, wood_025 (https://polyhaven.com/textures)
No additional art or sound assets used.

Credits

Textures: Poly Haven (CC0 license) for providing high-quality, royalty-free textures.
Font: Inter, available via Google Fonts.
Coursework: Developed for PUSL3122, focusing on HCI, UI/UX, and computer graphics.

License
This project is licensed under the MIT License. See the LICENSE file for details.
