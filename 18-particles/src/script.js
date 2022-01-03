import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/14.png');

/**
 * Particles
 */
//Particles Geometry

const positionArray = new Float32Array(20000 * 3 * 3);

//Different colors
// Remember to activate vertexColors on the material

const colorArray = new Float32Array(20000 * 3 * 3);


for (let i = 0; i < 20000 * 3 * 3; i += 1) {
    positionArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random()
}

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute('position',
    new THREE.BufferAttribute(positionArray, 3)    
)

bufferGeometry.setAttribute('color',
    new THREE.BufferAttribute(colorArray, 3)
)
console.log("🚀 ~ file: script.js ~ line 49 ~ bufferGeometry", bufferGeometry)



//Particles Material
const particleMaterial = new THREE.PointsMaterial({ 
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    // color: 'lightpink',
    vertexColors: true,
});
const particles = new THREE.Points(bufferGeometry, particleMaterial);
scene.add(particles);

//Fixing black borders

//There are many ways
//FIRST (ALPHA TEST)
// This way is very easy and works ok, but if the user looks closely, the borders still blocking the other particles
// particleMaterial.alphaTest = 0.001;

//SECOND (DEPTH TEST)
// What we do on this case is just say to webGL to render everything, despite who is in front of who.
// This way looks perfect on this example, but on scenes with other objects (like the cube) or other color particles, it might cause some bugs
// particleMaterial.depthTest = false;
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube);

//THIRD (DEPTH WHITE)
//The depth of what is being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what`s in this depth buffer, we can tell webgl to not write particles in that deph buffer
// In most cases, this will work

// particleMaterial.depthWrite = false;

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube);

//Bonus way (BLENDING)
//This might have performance issues
//This is not really a solution (because you will still need to use some of the three ways) but its an very cool effects
//Instead of just replacing a pixel with another, it blend them, generating a new color (put a star in front of another star, the star behind still visible)

particleMaterial.blending = THREE.AdditiveBlending;
particleMaterial.depthWrite = false;

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshNormalMaterial()
// )

// scene.add(cube);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //Animating particles

    // particles.rotation.y = elapsedTime * 0.2;

    for (let i = 0; i < particles.geometry.attributes.position.array.length; i += 3) {


        const x = particles.geometry.attributes.position.array[i]
        particles.geometry.attributes.position.array[i + 1] = Math.sin(x + elapsedTime)
        
    }

    //Particles need to update
    bufferGeometry.attributes.position.needsUpdate = true;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()