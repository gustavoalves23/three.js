import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const box1Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'red'})
);

const box2Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'green'})
);

box2Mesh.position.x = -1.5;

const box3Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'blue'})
);

box3Mesh.position.x = 1.5;


/**
 * Groups
 */

const group = new THREE.Group();
group.add(box1Mesh);
group.add(box2Mesh);
group.add(box3Mesh);
scene.add(group);

group.position.y = 1;

group.scale.y = 1.2;

group.rotation.z = 0.3;

/**
* AxesHelper
*/

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

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


scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})


renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)