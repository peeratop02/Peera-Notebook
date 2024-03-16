// Basic scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.75); // soft white light
scene.add(ambientLight);

// Expanded Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 2500;
const posArray = new Float32Array(particlesCnt * 3);
const colors = new Float32Array(particlesCnt * 3); // For storing shades of gray
for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10; // Spread particles more widely
  const gray = Math.random() * 0.3; // Start with even darker shades, up to 30% gray
  colors[i] = gray; // Assign the darker shade of gray to each color component
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Setting up the particlesMaterial with a general size
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025, // Base size for all particles
  vertexColors: THREE.VertexColors,
  transparent: true,
  opacity: 0.75,
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// Torus Knot with a gradient shader material
const geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 100, 16);
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
  }
`;
const material = new THREE.ShaderMaterial({
  uniforms: {
    color1: { value: new THREE.Color(0xff0000) },
    color2: { value: new THREE.Color(0x0000ff) },
  },
  vertexShader,
  fragmentShader,
});

const torusKnot = new THREE.Mesh(geometry, material);
// scene.add(torusKnot);

camera.position.z = 3;

// Mouse Movement Interaction
let mouseX = 0,
  mouseY = 0;
function onDocumentMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
}
document.addEventListener("mousemove", onDocumentMouseMove, false);

// Animation loop with color change
function animate() {
  requestAnimationFrame(animate);

  // Scene rotation based on cursor position
  const rotationSpeedX = mouseY * 0.02;
  const rotationSpeedY = mouseX * 0.02;
  particleMesh.rotation.x += rotationSpeedX * 0.4; // Slower rotation for particles for added effect
  particleMesh.rotation.y += rotationSpeedY * 0.4;

  // Apply a "wiggle" by slightly moving the entire mesh
  particleMesh.position.x = Math.sin(Date.now() * 0.001) * 0.1;
  particleMesh.position.y = Math.cos(Date.now() * 0.001) * 0.1;

  torusKnot.rotation.x += rotationSpeedX;
  torusKnot.rotation.y += rotationSpeedY;

  // Dynamically change particle colors within a range for a subtle effect
  const colors = particleMesh.geometry.attributes.color.array;
  for (let i = 0; i < colors.length; i += 3) {
    // Very subtle adjustment, ensuring we stay within dark shades
    const adjustment = 0.01 * (Math.random() - 0.5); // Minimize the adjustment
    colors[i] += adjustment; // Adjust R (red component)
    colors[i + 1] += adjustment; // Adjust G (green component)
    colors[i + 2] += adjustment; // Adjust B (blue component)

    // Clamp the color values to ensure they remain dark
    colors[i] = Math.max(0, Math.min(colors[i], 0.3)); // Clamping to 0.3 as the upper limit for darkness
    colors[i + 1] = Math.max(0, Math.min(colors[i + 1], 0.3));
    colors[i + 2] = Math.max(0, Math.min(colors[i + 2], 0.3));
  }
  particleMesh.geometry.attributes.color.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
