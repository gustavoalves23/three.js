import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, })
const mesh = new THREE.Mesh(geometry, material)

// POSITION

// first way
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1

//second way
mesh.position.set(0.7, -0.6, 1)

//SCALE

//first way

// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;

//second way

mesh.scale.set(2, 0.5, 0.5);

//ROTATION

//rotation way
mesh.rotation.reorder('YZX');
// ***** IMPORTANT ********
// REARRANGE THE ROTATION ORDER BEFORE CHANGE IT, OTHERWISE IT WILL NOT WORK
mesh.rotation.z = 0.5;
mesh.rotation.x = 0.1;

scene.add(mesh)

/**
* AxesHelper
*/

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

document.body.appendChild(document.createElement('H1'))
    .innerText = `Distância entre o centro da cena e o centro do objeto: ${mesh.position.length()} unidades`

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0,0,3);

//LOOK AT

camera.lookAt(mesh.position);

scene.add(camera)

document.body.appendChild(document.createElement('H1'))
    .innerText = `Distância entre o centro da camera e o centro do objeto: ${mesh.position.distanceTo(camera.position)} unidades`


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})


renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)