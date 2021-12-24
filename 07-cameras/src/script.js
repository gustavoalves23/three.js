import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000  })
)

mesh.position.y = 3
scene.add(mesh)

// Perspective Camera
const camera = new THREE.PerspectiveCamera(75 , sizes.width / sizes.height, 0.1 , 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3

scene.add(camera)

// Orthographic Camera

/**
// const camera = new THREE.OrthographicCamera(-1,1,1,-1)
 * This way, the box will look stretched horizontaly. This happen because our camera is rendering an square (-1,1,1,-1), but our scene is redered 
on a rectangular shape, so it will stretch horizontaly to fit it.
to solve that, we can multiply both horizontal paramenters (left and right) by the aspect ratio, so it will be a little bit larger compared to the vertical
ones.
 */
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(aspectRatio * -1, aspectRatio * 1, 1, -1, 0.1, 100);

// camera.position.x = 2
// camera.position.y = 2
// camera.position.z = 2

//  camera.lookAt(mesh.position)
//  scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// Animate
const clock = new THREE.Clock()


/**
 * moving things with cursor/finger
 */

// 1 - we need the position of the cursor

// const cursor = {
//     x: 0,
//     y: 0,
// }
// window.addEventListener('mousemove', (event) => {
//     cursor.x = event.clientX / sizes.width - 0.5;
//     cursor.y = (event.clientY / sizes.height - 0.5) * -1;
// })

const controls = new OrbitControls(camera, canvas)
controls.target = mesh.position;
controls.enableDamping = true


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // camera.position.x = Math.sin(cursor.x * 2 * Math.PI) * 2;
    // camera.position.z = Math.cos(cursor.x * 2 * Math.PI) * 2;
    // camera.position.y = cursor.y * 3; 

controls.update()
    
    // camera.lookAt(mesh.position);


    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
} 

tick()