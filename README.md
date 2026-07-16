<div align="center">

# 🧴 Bolly Shampoo: 3D Interactive Landing Page

**A highly immersive, WebGL-powered 3D product experience built for modern browsers.**

[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)

### 🌐 [Visit the Live 3D Demo!](https://3d-project-tan.vercel.app/)

*An assignment submission demonstrating advanced frontend rendering, responsive architecture, and fluid typography.*

---

</div>

## ✨ Key Features

This project was developed strictly against assignment requirements, featuring:

- **📦 Real-time 3D Object Rendering:** The shampoo bottle is a custom STL model rendered using WebGL, showcasing physical material properties like roughness, clearcoat, and index of refraction (IOR).
- **🖐️ Interactive Controls:** Natively supports both **desktop cursor dragging** and **mobile touch gestures** to seamlessly rotate and inspect the product.
- **💡 Studio Lighting Simulation:** Implements a dynamic lighting rig (Key, Fill, Rim, Ambient, and PMREM environment) to create photorealistic gloss and shadows.
- **📱 Fluid Responsiveness (Down to 320px):** 
  - *Desktop/Tablet:* Utilizes a robust `position: absolute` overlay layout to achieve stunning depth-of-field over the 3D canvas.
  - *Mobile:* Intelligently collapses into a vertical flexbox layout, using `clamp()` typography to prevent overlapping or horizontal scrolling on devices as narrow as 320px.
- **🎨 Pixel-Perfect Replication:** Strict adherence to the provided design reference, including color hexes, typography (Inter & DM Serif Display), and the custom SVG cart UI.
- **⚙️ WordPress / Elementor Ready:** Code is modular and isolated, ready to be embedded into any WordPress Elementor HTML widget.

<br/>

## 🚀 Quick Start

To run this project locally, ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/IshaqShaik9014/3d-project.git

# 2. Navigate into the directory
cd 3d-project

# 3. Install dependencies
npm install

# 4. Start the Vite development server
npm run dev
```

Your browser will automatically open the project at `http://localhost:5173`.

<br/>

## 🛠️ Tech Stack & Architecture

- **Core Engine:** `Three.js` is used to load the STL geometry, generate the PBR materials, and handle the animation loop.
- **Camera & Controls:** Utilizes `PerspectiveCamera` with automated FOV adjustments for mobile, alongside `OrbitControls` with damping enabled for silky-smooth rotation.
- **Build Tool:** `Vite` provides instant Hot Module Replacement (HMR) and bundles the final assets for production.
- **Styling:** Pure Vanilla CSS using custom variables and advanced media queries. No heavy CSS frameworks were used, ensuring lightning-fast load times.

<br/>

## 📦 WordPress Integration Instructions

This project is structured so it can be seamlessly embedded into **WordPress Elementor**. 

Check out the [WORDPRESS-ELEMENTOR-INTEGRATION.md](./WORDPRESS-ELEMENTOR-INTEGRATION.md) file included in this repository for a step-by-step guide on how to paste this code into a live Elementor staging site using the Custom HTML Widget.

<br/>

<div align="center">
  <i>Developed by Ishaq Shaik for the Frontend Development Assignment</i>
</div>
