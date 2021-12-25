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

Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const edges = new THREE.EdgesGeometry(geometry)
// const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));

// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(line)
// scene.add(mesh)

// Testing other basic geometry

const group = new THREE.Group();
scene.add(group);

const geometrys = [
    'BoxGeometry',
    'CircleGeometry',
    'ConeGeometry',
    'CylinderGeometry',
    'DodecahedronGeometry',
    'ExtrudeGeometry',
    'TubeGeometry',
    'IcosahedronGeometry',
    'OctahedronGeometry',
    'PlaneGeometry',
    'RingGeometry',
    'ShapeGeometry',
    'SphereGeometry',
    'TetrahedronGeometry',
    'TorusGeometry',
    'TorusKnotGeometry',
    

]

let offset = 0;

geometrys.forEach((object) => {
    const geometry = new THREE[object]
    const material = new THREE.MeshBasicMaterial({ color: 'lightblue' })
    const mesh = new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));
    mesh.position.x += offset;
    line.position.x += offset;
    offset += 3;
    group.add(mesh);
    group.add(line);
})

let actualGeometry = 0;

document.addEventListener('keydown', (e) => {
    console.log(group.position.x)
    if (e.key === 'ArrowRight' && group.position.x > -3 * geometrys.length + 3) {
        group.position.x -= 3;
        actualGeometry += 1;
    } else if (e.key === 'ArrowLeft' && group.position.x < 0) {
        group.position.x += 3;
        actualGeometry -= 1;
    }
})

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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

    document.querySelector('h2').innerHTML = geometrys[actualGeometry]

}

tick()