import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Handle full screen

//everything with webkit is related to safari problems, basically it always check if the older (webkit...) exists, with is only the case on safari, 
//other browsers use the newer simple version without webkit...


window.addEventListener('dblclick', () => {
const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
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

//PixelRatio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.querySelector('h1').innerHTML = `Pixel Ratio = ${renderer.getPixelRatio()}`






/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


//Resize

window.addEventListener('resize', () => {
    //Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Updating Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height);

    //PixelRatio update
    // We put this in here too because, if the user change the monitor, the renderer pixelRatio will be updated together
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

tick()