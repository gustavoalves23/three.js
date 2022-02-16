import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const guiConfig = {
    speed: 0.05,
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const flagTexture = textureLoader.load('/textures/flag-french.jpg');

flagTexture.minFilter = THREE.NearestFilter;

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1,1, 128 ,128);

const { count } = geometry.attributes.position;

let random = new Float32Array(count);

for (let i = 0; i < count; i += 1) {
    random[i] = (Math.random());
}

geometry.setAttribute('aRandom',new THREE.BufferAttribute(random, 1));

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTimeStamp: {value: 0},
        uFrequency: {value: new THREE.Vector2(5, 5)},
        // uColor: {value: new THREE.Color('orange')},
        uTexture: {value: flagTexture}
    }
})


gui.add(material.uniforms.uFrequency.value,'x').min(1).max(50).step(0.001).name('frequencyX');
gui.add(material.uniforms.uFrequency.value,'y').min(1).max(50).step(0.001).name('frequencyY');
// gui.addColor(material.uniforms.uColor, 'value').name('color');
gui.add(guiConfig, 'speed').min(0).max(1).step(0.001);


// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3;
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
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

    material.uniforms.uTimeStamp.value += guiConfig.speed;

    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()