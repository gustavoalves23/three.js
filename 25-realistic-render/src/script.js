import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    const content = [...gltf.scene.children];
    content.forEach((c) => scene.add(c))
})


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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);

scene.add(lightHelper);

const updateHelper = () => {
    lightHelper.update()
}

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('LightIntensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX').onChange(updateHelper);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY').onChange(updateHelper);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ').onChange(updateHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.physicallyCorrectLights = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()