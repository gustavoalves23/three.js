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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

const raycasterOrigin = new THREE.Vector3(-3 , 0, 0);
const raycasterDirection = new THREE.Vector3(10, 0, 0);

raycasterDirection.normalize()

raycaster.set(raycasterOrigin, raycasterDirection);

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
const clock = new THREE.Clock();

let currentIntersect = null;

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX/window.innerWidth * 2 - 1;
    mouse.y = - (e.clientY/window.innerHeight) * 2 + 1;
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click obj1');
                break;
            case object2:
                console.log('click obj2');
                break;
            case object3:
                console.log('click obj3');
                break;
            default:
                console.log('other obj');
        }
    }
})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    //Animating spheres

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    //Raycasting

    // const raycasterOrigin = new THREE.Vector3(-3, 0 ,0);
    // const raycasterDirection = new THREE.Vector3(10, 0 ,0);

    // raycasterDirection.normalize();

    // raycaster.set(raycasterOrigin, raycasterDirection);

    // const objectsToIntersect = [object1, object2, object3];

    // const instersects = raycaster.intersectObjects(objectsToIntersect)

    // instersects.forEach(({ object }) => {
    //     object.material.color.set(0xFFFF00)
    // })

    // const notIntersect = objectsToIntersect.filter((object) => !instersects.map((item) => item.object.uuid).some((list) => object.uuid === list))
    // notIntersect.forEach((object) => {
    //     object.material.color.set(0xff0000)
    // })

    //Interacting with the mouse

    raycaster.setFromCamera(mouse, camera);

    const objectsToIntersect = [object1, object2, object3];

    const instersects = raycaster.intersectObjects(objectsToIntersect)

    if (instersects.length) {
        if (!currentIntersect) {
            currentIntersect = instersects[0];
        }
    } else {
        if (currentIntersect) {
            currentIntersect=null;
        }
    }

    instersects.forEach(({ object }) => {
        object.material.color.set(0xFFFF00)
    })

    const notIntersect = objectsToIntersect.filter((object) => !instersects.map((item) => item.object.uuid).some((list) => object.uuid === list))
    notIntersect.forEach((object) => {
        object.material.color.set(0xff0000)
    })


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()