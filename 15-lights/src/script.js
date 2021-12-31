import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

gui.add({func: () => document.location.reload(true)}, 'func').name('RESET');
gui.add(axesHelper, 'visible').name('Axes Helper');

/**
 * Lights
 */

//Ambient Light

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
ambientLight.visible = false;
scene.add(ambientLight);

const ambientLightFolder =  gui.addFolder('ambientLight');
ambientLightFolder.close();

ambientLightFolder.add(ambientLight, 'visible');
ambientLightFolder.addColor(ambientLight, 'color');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001);

//Directional Light
//This light always points to the center of the scene with parallel rays.

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
directionalLight.visible = false;
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);
scene.add(directionalLight);

const directionalLightFolder = gui.addFolder('directionalLight');
directionalLightFolder.close();

directionalLightFolder.add(directionalLight, 'visible');
directionalLightFolder.add(directionalLightHelper, 'visible').name('helper');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('Position x');
directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('Position y');
directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('Position z');

//Hemisphere Light

const hemisphereLight = new THREE.HemisphereLight(0xFF0000, 0x0000ff, 0.3);
hemisphereLight.visible = false;
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 3);
hemisphereLightHelper.visible = false;
scene.add(hemisphereLight);
scene.add(hemisphereLightHelper);

const hemisphereLightFolder = gui.addFolder('hemisphereLight');
hemisphereLightFolder.close();

const updateHemisphereLightHelper = () => {
    hemisphereLightHelper.update();
}

hemisphereLightFolder.add(hemisphereLight,'visible');
hemisphereLightFolder.add(hemisphereLightHelper,'visible').name('helper');
hemisphereLightFolder.add(hemisphereLight,'intensity', 0, 1);
hemisphereLightFolder.addColor(hemisphereLight,'color').name('skyColor').onChange(updateHemisphereLightHelper);
hemisphereLightFolder.addColor(hemisphereLight,'groundColor').name('groundColor').onChange(updateHemisphereLightHelper);

//Point Light

const pointLight = new THREE.PointLight(0xff9000, 0.5);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 3);
pointLight.visible = false;
pointLightHelper.visible = false;
scene.add(pointLightHelper);
scene.add(pointLight);

const pointLightFolder = gui.addFolder('pointLight');
pointLightFolder.close();

pointLightFolder.add(pointLight, 'visible');
pointLightFolder.add(pointLightHelper, 'visible').name('helper');
pointLightFolder.addColor(pointLight, 'color').onChange(() => pointLightHelper.update());
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001);
pointLightFolder.add(pointLight, 'distance').min(0).max(20);
pointLightFolder.add(pointLight, 'decay').min(0).max(20);
pointLightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.001).name('position x');
pointLightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.001).name('position y');
pointLightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.001).name('position z');

//RectArea light

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
rectAreaLight.visible = false;
scene.add(rectAreaLight);
scene.add(rectAreaLightHelper);

const rectAreaLightFolder = gui.addFolder('rectAreaLight');
rectAreaLightFolder.close();

rectAreaLightFolder.add(rectAreaLight, 'visible');
rectAreaLightFolder.add(rectAreaLightHelper, 'visible').name('helper');
rectAreaLightFolder.addColor(rectAreaLight, 'color');
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(10);
rectAreaLightFolder.add(rectAreaLight, 'width').min(0).max(10).step(0.001);
rectAreaLightFolder.add(rectAreaLight, 'height').min(0).max(10).step(0.001);
rectAreaLightFolder.add(rectAreaLight.position, 'x').min(-10).max(10).step(0.001).name('position x');
rectAreaLightFolder.add(rectAreaLight.position, 'y').min(-10).max(10).step(0.001).name('position y');
rectAreaLightFolder.add(rectAreaLight.position, 'z').min(-10).max(10).step(0.001).name('position z');

rectAreaLightFolder.add(rectAreaLight.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('rotation x');
rectAreaLightFolder.add(rectAreaLight.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation y');
rectAreaLightFolder.add(rectAreaLight.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001).name('rotation z');

//Spot Light

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
scene.add(spotLight); 

const spotLightFolder = gui.addFolder('spotLight');
spotLightFolder.close();

spotLightFolder.add(spotLight, 'visible');
spotLightFolder.add(spotLightHelper, 'visible').name('helper');
spotLightFolder.addColor(spotLight, 'color').onChange(() => spotLightHelper.update());
spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001);
spotLightFolder.add(spotLight, 'distance').min(0).max(20).step(0.001).onChange(() => spotLightHelper.update());
spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI / 2).step(0.001).onChange(() => spotLightHelper.update());
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1);
spotLightFolder.add(spotLight, 'decay').min(0).max(20);

spotLightFolder.add(spotLight.position, 'x').min(-10).max(10).step(0.001).name('position x').onChange(() => spotLightHelper.update());
spotLightFolder.add(spotLight.position, 'y').min(-10).max(10).step(0.001).name('position y').onChange(() => spotLightHelper.update());
spotLightFolder.add(spotLight.position, 'z').min(-10).max(10).step(0.001).name('position z').onChange(() => spotLightHelper.update());


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()