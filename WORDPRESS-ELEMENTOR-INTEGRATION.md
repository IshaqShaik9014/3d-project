# WordPress & Elementor Integration Guide

This guide explains how to properly embed the custom 3D interactive shampoo bottle into a WordPress site using the Elementor page builder.

## Prerequisites
- A WordPress installation with Elementor installed.
- Access to the Elementor visual editor.

## Approach: Elementor HTML Widget
The most reliable way to integrate Three.js without conflicting with Elementor's internal asset pipeline is to use an **HTML Widget** within your Elementor column. 

### Step 1: Prepare the HTML Container
1. Open your page in Elementor.
2. Drag and drop an **HTML Widget** into the desired column (typically the center column of your Hero section).
3. Insert the following code to create a container for the 3D canvas:
```html
<div id="three-bottle-container" style="width: 100%; height: 500px; position: relative; cursor: grab;">
    <div class="interaction-hint" style="position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%); font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 600; color: rgba(0,0,0,0.4); pointer-events: none; animation: pulse 2s infinite;">Drag to rotate</div>
</div>

<style>
@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}
#three-bottle-container:active { cursor: grabbing; }
</style>
```

### Step 2: Include Three.js via CDN
In the same HTML Widget (or in Elementor Custom Code settings), add the Three.js library and OrbitControls modules. Using an ES-module script tag is recommended:
```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
</script>
```

### Step 3: Insert Custom JavaScript
Paste the custom JavaScript logic into a `<script type="module">` tag immediately following the import map in the HTML widget.

> **Note on Adaptations for Elementor:**
> Change `document.getElementById('app')` to `document.getElementById('three-bottle-container')`.
> Ensure the scene renderer mounts to this specific container. 

```html
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const appContainer = document.getElementById('three-bottle-container');

// Include all the scene setup, bottle geometry, lighting, and animation loop code here from main.js!
// Make sure onWindowResize uses appContainer.clientWidth / appContainer.clientHeight.
</script>
```

### Step 4: Testing & Responsiveness
Elementor columns have their own padding. Ensure that the parent column holding the HTML widget has `padding: 0` so the canvas fills the space appropriately.

To test mobile touch rotation:
1. Use Elementor's responsive mode viewer (Tablet and Mobile icons at the bottom of the Elementor panel).
2. Adjust the inline `height: 500px` property on the container to something smaller (e.g. `400px`) using Elementor Custom CSS media queries if needed.

```css
@media (max-width: 768px) {
    #three-bottle-container {
        height: 400px !important;
    }
}
```

By isolating the WebGL context strictly within the `#three-bottle-container`, Elementor’s visual editor won't interfere with the 3D rendering.
