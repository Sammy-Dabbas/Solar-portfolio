### Beautiful Constellation - 3D Portfolio

A stunning interactive portfolio website featuring both a traditional 2D view and an immersive 3D solar system experience. Navigate through planets representing different projects and skills in a space-themed environment.

Demo here: https://v0-beautiful-constellation.vercel.app/



## Features

- **Dual View Experience**: Switch between traditional 2D portfolio and immersive 3D solar system view
- **Interactive Solar System**: Explore projects by interacting with planets in a 3D space
- **Responsive Design**: Fully responsive on all devices
- **Dynamic Project Cards**: Click on planets to view detailed project information
- **Animated Background**: Shooting stars and twinkling background stars
- **Skills Constellation**: Visual representation of skills as star constellations
- **3D Text Effects**: Beautiful 3D text with lighting and material effects
- **Smooth Camera Transitions**: Cinematic camera movements when selecting projects


## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React Three Fiber**: React renderer for Three.js
- **Three.js**: JavaScript 3D library
- **React Three Drei**: Useful helpers for React Three Fiber
- **Framer Motion**: Animation library for React
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework


## Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/beautiful-constellation.git
cd beautiful-constellation
```


2. Install dependencies:

```shellscript
npm install
```


3. Create a `public/fonts` directory and download the required font files:

```shellscript
mkdir -p public/fonts
```



4. Run the development server:

```shellscript
npm run dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.


## Usage

### 2D Portfolio View

The 2D view provides a traditional portfolio experience with sections for:

- About Me
- Work Experience
- Education
- Projects
- Skills
- Contact Information


Navigate through sections using the top navigation bar or by scrolling.

### 3D Solar System View

Switch to the 3D view by clicking "Explore Solar System" in the navigation bar. In this view:

1. **Navigation**: Use mouse to orbit around the solar system

1. Left-click and drag to rotate
2. Scroll to zoom in/out
3. Right-click and drag to pan



2. **Interaction**:

1. Click on the sun to view your personal information
2. Click on planets to view detailed project information
3. Hover over skills in the constellation to highlight them



3. **Return to 2D**: Click "Switch to 2D View" in the top right corner to return to the traditional portfolio view


## Project Structure

```plaintext
beautiful-constellation/
├── app/                      # Next.js app directory
│   ├── components/           # React components
│   │   ├── AsteroidBelt.tsx  # Asteroid belt visualization
│   │   ├── ClientOnly.tsx    # Client-side rendering wrapper
│   │   ├── CosmicSkills.tsx  # Skills visualization
│   │   ├── SolarSystem.tsx   # Main solar system component
│   │   ├── WelcomeText3D.tsx # 3D text component
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   ├── solar-system/         # 3D view page
│   ├── utils/                # Utility functions
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # 2D portfolio page
├── public/                   # Static assets
│   └── fonts/                # 3D text font files
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Customization

### Updating Personal Information

1. Edit the personal information in `app/page.tsx` for the 2D view
2. Update project data in `app/components/SolarSystem.tsx` for the 3D view


### Adding New Projects

To add a new project to the solar system:

1. Open `app/components/SolarSystem.tsx`
2. Add a new entry to the `planets` array with your project details:

```typescript
{
  name: "Project Name",
  radius: 15,
  orbitRadius: 280,
  speed: 0.004,
  initialAngle: Math.random() * Math.PI * 2,
  project: {
    title: "Project Title",
    description: "Project description...",
    link: "https://github.com/yourusername/project",
    technologies: ["React", "Node.js", "MongoDB"],
  },
  texturePath: "/path/to/texture.jpg",
}
```




### Updating Skills

To update the skills constellation:

1. Open `app/components/CosmicSkills.tsx`
2. Modify the `skills` array with your skills and their relationships


## Performance Optimization

For optimal performance:

- Use compressed textures for planets
- Adjust the number of stars and asteroids based on device performance
- Consider using lower polygon counts for 3D text on mobile devices


## Credits

- Planet textures: [Solar System Scope](https://www.solarsystemscope.com/textures/)
- Font files: [Three.js](https://github.com/mrdoob/three.js)
- 3D techniques inspired by [Bruno Simon](https://bruno-simon.com/)


## License

This project is licensed under the MIT License - see the LICENSE file for details.
