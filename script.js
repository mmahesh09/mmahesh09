// Initialize the scene
const scene = new THREE.Scene();

// Initialize the camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

// Initialize the renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#three-canvas'),
    alpha: true // To make the background transparent
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Add directional lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load the 3D model
const loader = new THREE.GLTFLoader();
loader.load('workspace.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, -1, 0);
    model.scale.set(2, 2, 2);
}, undefined, function(error) {
    console.error(error);
});

// Position the camera
camera.position.z = 5;

// Add mouse controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // For smooth controls

// Create animated background with stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model for some basic interactivity
    scene.children.forEach(child => {
        if (child.isGroup) {
            child.rotation.y += 0.01;
        }
    });

    // Rotate the stars for background animation
    stars.rotation.y += 0.001;

    controls.update(); // Update controls
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update sizes
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

animate();