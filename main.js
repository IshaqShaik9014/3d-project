import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// --- SETUP ---
const appContainer = document.getElementById('app');
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(appContainer.clientWidth, appContainer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
appContainer.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(35, appContainer.clientWidth / appContainer.clientHeight, 0.1, 100);
camera.position.set(0, 0, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 15;

let userInteracting = false;
controls.addEventListener('start', () => { userInteracting = true; });

// --- ENVIRONMENT AND LIGHTING ---
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.bias = -0.001;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0xffffff, 1.5);
fillLight.position.set(-5, 2, 4);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xffffff, 2.0);
rimLight.position.set(0, 3, -6);
scene.add(rimLight);

// --- GROUPS ---
const animGroup = new THREE.Group();
scene.add(animGroup);

const productGroup = new THREE.Group();
animGroup.add(productGroup);

// --- CLIPPING PLANES ---
const stlSplitZ = 10.0; 
const localPlanePurple = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0); 
const localPlaneWhite = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const worldPlanePurple = new THREE.Plane();
const worldPlaneWhite = new THREE.Plane();

// --- MATERIALS ---
const bottleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6337A8,
    metalness: 0.0,
    roughness: 0.28, 
    clearcoat: 0.85, 
    clearcoatRoughness: 0.18,
    ior: 1.46,
    side: THREE.DoubleSide,
    clippingPlanes: [worldPlanePurple]
});

const pumpMaterial = new THREE.MeshStandardMaterial({
    color: 0xF5F3F1,
    roughness: 0.65,
    metalness: 0.0,
    side: THREE.DoubleSide,
    clippingPlanes: [worldPlaneWhite]
});

// --- HELPER: CONFORMAL RAYCAST LABEL ---
function createConformalLabel(width, height, position, texture, targetMesh) {
    const geo = new THREE.PlaneGeometry(width, height, 64, 32);
    const posAttribute = geo.attributes.position;
    
    const raycaster = new THREE.Raycaster();
    const rayDir = new THREE.Vector3(0, 0, -1);
    
    // Ensure world matrices are up to date before raycasting
    targetMesh.updateMatrixWorld(true);
    
    const rayOrigin = new THREE.Vector3();
    const planeLocal = new THREE.Vector3();
    
    for (let i = 0; i < posAttribute.count; i++) {
        const vx = posAttribute.getX(i);
        const vy = posAttribute.getY(i);
        
        // Start ray 2 units in front of the target Z position to ensure it hits the bottle
        planeLocal.set(vx + position.x, vy + position.y, position.z + 2.0); 
        rayOrigin.copy(planeLocal);
        
        raycaster.set(rayOrigin, rayDir);
        // Intersect with the specific mesh (meshPurple)
        const intersects = raycaster.intersectObject(targetMesh, false);
        
        if (intersects.length > 0) {
            const hit = intersects[0];
            // Add a microscopic offset along the normal to prevent z-fighting
            const offset = 0.003; 
            const finalX = hit.point.x + hit.normal.x * offset;
            const finalY = hit.point.y + hit.normal.y * offset;
            const finalZ = hit.point.z + hit.normal.z * offset;
            posAttribute.setXYZ(i, finalX, finalY, finalZ);
        } else {
            // If ray misses (e.g., label is wider than bottle silhouette), curve it artificially backward
            // This prevents straight edges sticking out into space
            const finalZ = position.z - Math.abs(vx) * 0.5;
            posAttribute.setXYZ(i, vx + position.x, vy + position.y, finalZ);
        }
    }
    
    geo.computeVertexNormals();
    
    const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, 0); 
    return mesh;
}

// --- TEXTURES ---
function createFrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    document.fonts.ready.then(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        
        const leftMargin = 150;
        const rightMargin = 1900; 
        
        // TOP-LEFT: PROFESSIONAL HAIRCARE
        ctx.textAlign = 'left';
        ctx.font = '600 40px "Inter", "Helvetica Neue", sans-serif';
        ctx.fillText('PROFESSIONAL', leftMargin, 500);
        ctx.font = '500 50px "Inter", "Helvetica Neue", sans-serif';
        ctx.fillText('HAIRCARE', leftMargin, 560);
        
        // TOP-RIGHT: bolly
        ctx.textAlign = 'right';
        if ('letterSpacing' in ctx) {
            ctx.letterSpacing = '-15px';
        }
        ctx.font = '900 420px "Arial Black", "Inter", "Helvetica Neue", sans-serif';
        ctx.fillText('bolly', rightMargin, 620); 
        
        if ('letterSpacing' in ctx) {
            ctx.letterSpacing = '0px'; 
        }
        
        // BOTTOM-LEFT: 300ml
        ctx.textAlign = 'left';
        ctx.font = '800 65px "Inter", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText('300ml', leftMargin, 1750);
        
        // BOTTOM-RIGHT: Deep Cleanser Shampoo block
        ctx.textAlign = 'right';
        ctx.font = '600 130px "Inter", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText('Deep Cleanser', rightMargin, 1450);
        
        ctx.font = '500 120px "Inter", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText('Shampoo', rightMargin, 1600);
        
        ctx.font = '400 50px "Inter", "Helvetica Neue", Arial, sans-serif';
        ctx.fillText('Scalp reset + deep cleanser', rightMargin, 1750);
        
        texture.needsUpdate = true;
    });
    
    return texture;
}

// --- LOAD STL ---
const loader = new STLLoader();
loader.load(
    '/Shampoo-3d.stl',
    function (geometry) {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.center(); 
        
        const bbox = geometry.boundingBox;
        const size = new THREE.Vector3();
        bbox.getSize(size);
        
        const targetHeight = 2.5;
        const scaleFactor = targetHeight / size.z;
        
        const splitY = stlSplitZ * scaleFactor;
        localPlanePurple.constant = splitY;
        localPlaneWhite.constant = -splitY;
        
        // 1. Purple Mesh
        const meshPurple = new THREE.Mesh(geometry, bottleMaterial);
        meshPurple.scale.set(scaleFactor, scaleFactor, scaleFactor);
        meshPurple.rotation.x = -Math.PI / 2;
        meshPurple.castShadow = true;
        meshPurple.receiveShadow = true;
        productGroup.add(meshPurple);
        
        // 2. White Pump Mesh
        const meshWhite = new THREE.Mesh(geometry, pumpMaterial);
        meshWhite.scale.set(scaleFactor, scaleFactor, scaleFactor);
        meshWhite.rotation.x = -Math.PI / 2;
        meshWhite.castShadow = true;
        meshWhite.receiveShadow = true;
        productGroup.add(meshWhite);
        
        // --- BRANDING ---
        // Ensure meshPurple matrix is updated BEFORE we raycast against it
        productGroup.updateMatrixWorld(true);

        const actualWidth = size.x * scaleFactor;
        const actualDepth = size.y * scaleFactor;
        
        // Body bounds in Y after scaling
        const bodyTopY = splitY; // ~0.25
        const bodyBottomY = bbox.min.z * scaleFactor; // ~-1.24
        const bodyHeight = bodyTopY - bodyBottomY; // ~1.5
        
        // SINGLE UNIFIED FRONT LABEL
        const frontWidth = actualWidth * 0.95; 
        const frontHeight = bodyHeight * 0.95; 
        
        const frontY = bodyTopY - (bodyHeight / 2);
        const frontX = 0;
        const frontZ = actualDepth / 2; 

        const frontLabel = createConformalLabel(
            frontWidth, 
            frontHeight, 
            new THREE.Vector3(frontX, frontY, frontZ), 
            createFrontTexture(), 
            meshPurple
        );
        productGroup.add(frontLabel);

        // --- PRODUCT ORIENTATION AND SCALE ---
        // Apply presentation transform AFTER Raycasting is complete
        productGroup.rotation.z = 12 * Math.PI / 180;
        productGroup.rotation.y = -15 * Math.PI / 180;
        
        productGroup.scale.set(1.6, 1.6, 1.6);
        productGroup.position.y = -0.4;
        
        // Hide loader once geometry is parsed and added to scene
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
            loaderElement.classList.add('hidden');
        }
    },
    undefined,
    (error) => {
        console.error("An error happened loading the STL", error);
    }
);

// --- PRESENTATION SHADOW ---
const shadowCanvas = document.createElement('canvas');
shadowCanvas.width = 256;
shadowCanvas.height = 256;
const sCtx = shadowCanvas.getContext('2d');
const gradient = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
gradient.addColorStop(0, 'rgba(0,0,0,0.15)'); 
gradient.addColorStop(1, 'rgba(0,0,0,0)');
sCtx.fillStyle = gradient;
sCtx.fillRect(0,0,256,256);
const shadowTex = new THREE.CanvasTexture(shadowCanvas);

const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 3.5), 
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.8 })
);
contactShadow.rotation.x = -Math.PI / 2;
contactShadow.position.y = -2.5; 
scene.add(contactShadow);

// --- RENDER LOOP & RESIZE ---
function onWindowResize() {
    if (!appContainer) return;
    const width = appContainer.clientWidth;
    const height = appContainer.clientHeight;
    camera.aspect = width / height;
    
    // Responsive camera framing: pull back on narrow/mobile screens
    if (camera.aspect < 1) {
        camera.position.z = 11 * (1.1 / camera.aspect);
    } else {
        camera.position.z = 11;
    }
    
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
const resizeObserver = new ResizeObserver(() => onWindowResize());
resizeObserver.observe(appContainer);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (!userInteracting) {
        animGroup.rotation.y += delta * 0.1; 
    }

    worldPlanePurple.copy(localPlanePurple).applyMatrix4(productGroup.matrixWorld);
    worldPlaneWhite.copy(localPlaneWhite).applyMatrix4(productGroup.matrixWorld);

    controls.update();
    renderer.render(scene, camera);
}

animate();
