# Bolly Shampoo 3D Interactive Landing Page

This repository contains the source code for the Bolly Shampoo interactive 3D landing page, developed as a high-performance frontend assignment. It features a fully responsive, pixel-perfect UI and a custom 3D WebGL product experience.

## Assignment Requirements Fulfilled

### 1. Landing Page & Design Accuracy
The landing page accurately replicates the reference design:
* **Typography:** Utilizes fluid typography (`clamp()`) to perfectly match the heavy sans-serif headers and elegant serif supporting text.
* **Layout:** Implements a robust absolute-positioned overlay layout. The 3D canvas sits behind the text on large screens (Desktop/Tablet) to achieve the seamless depth effect, and gracefully collapses into a stacked flexbox layout on mobile.
* **Aesthetics:** Matches the exact color palette, including the `#855ef5` purple, the `#d6f22e` lime green cart button, the soft violet background shadow, and the subtle ambient noise texture.

### 2. Interactive 3D Product
Built using **Three.js**, the shampoo bottle is a fully interactive 3D object:
* **Desktop:** Users can click and drag with their cursor to rotate the bottle.
* **Mobile:** Users can use touch gestures to swipe and rotate the bottle smoothly.
* **Dynamic Lighting:** Includes ambient and directional lighting to replicate studio lighting, highlighting the glossy finish of the bottle.

### 3. Responsive Design
The experience is flawlessly responsive across all devices:
* **Desktop (1024px+):** Immersive 3-column overlay with the bottle taking center stage.
* **Tablet (768px - 1024px):** Retains the 3-column overlay by fluidly scaling the typography to prevent overlapping.
* **Mobile (320px - 768px):** Automatically switches to a clean, vertically stacked layout. The 3D canvas recalculates its Field of View (FOV) based on the portrait aspect ratio, guaranteeing the bottle is never cut off on narrow screens. 

### 4. Code Quality & WordPress Integration
The codebase is clean, modular, and built using Vite for instant HMR and optimized bundling. 
* **WordPress + Elementor:** The HTML, CSS, and JS components are structured so they can be seamlessly ported into a WordPress Elementor environment via the Custom HTML widget. 
* Please refer to the `WORDPRESS-ELEMENTOR-INTEGRATION.md` file in this repository for exact instructions on embedding the Three.js scene into Elementor without conflicts.

## Running the Project Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Technologies Used
* HTML5 / Vanilla CSS3
* JavaScript (ES6+)
* Three.js (WebGL rendering)
* Vite (Build tool)
