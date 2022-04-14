import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const vertexDefault = `
uniform float uTime;
varying float vTime;

void main()
{
    vTime = uTime;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}`

const fragmentDefault = `
void main()
{
    gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
}`

const save = (force = false) => {
    console.log(force);
    if (vertexInput.value !== vertexDefault || fragmentInput.value !== fragmentDefault || force) {
        material.dispose();
        material.fragmentShader = fragmentInput.value;
        material.vertexShader = vertexInput.value;
        mesh.material = material;
        localStorage.setItem('fragmentShader', fragmentInput.value);
        localStorage.setItem('vertexShader', vertexInput.value);
    }
}

const reset = () => {
    vertexInput.value = vertexDefault;
    fragmentInput.value = fragmentDefault;
    save(true);
    localStorage.setItem('vertexShader', '');
    localStorage.setItem('fragmentShader', '');
}

document.getElementsByTagName('button')[2].addEventListener('click', reset);

const vertexInput = document.getElementsByClassName('text-input')[0];
vertexInput.value = localStorage.getItem('vertexShader') || vertexDefault;
const fragmentInput = document.getElementsByClassName('text-input')[1];
fragmentInput.value = localStorage.getItem('fragmentShader') || fragmentDefault;

document.getElementsByTagName('button')[1].addEventListener('click', () => save());

document.getElementsByTagName('button')[0].addEventListener('click', () => {
    fragmentInput.classList.toggle('hidden');
    vertexInput.classList.toggle('hidden');
    document.getElementsByTagName('button')[0].innerText = document.getElementsByTagName('button')[0].innerText === 'Vertex Shader' ? 'Fragment Shader' : 'Vertex Shader';
})


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexInput.value,
    fragmentShader: fragmentInput.value,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {value: 0}
    }
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
    camera.lookAt(new THREE.Vector3(0,0,0));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / (sizes.height/2), 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
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
renderer.setSize(sizes.width, sizes.height/2)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const Clock = new THREE.Clock();
const tick = () =>
{
    // Update controls

    const elapsedTime = Clock.getElapsedTime();

    material.uniforms.uTime.value = elapsedTime;
    controls.update()

    // Render
    renderer.render(scene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()