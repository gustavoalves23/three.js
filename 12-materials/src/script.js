import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

/**
 * debug ui
 */

const gui = new dat.GUI();

/**
 * Textures
 */

 const textureLoader = new THREE.TextureLoader();

 const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
 const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
 const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
 const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
 const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
 const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
 const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
 const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
 const matCapTexture = textureLoader.load('/textures/matcaps/8.png');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
 * Objects
 */


// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0xFF00FF);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.BackSide;

// const material = new THREE.MeshNormalMaterial();
//normally used for debug, but it looks cool
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matCapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();
//this need some light
//this doesnt look as good but its lighweight for gpu

// const material = new THREE.MeshPhongMaterial();
//this need some light
//this look good and more realistic
// material.shininess = 1000
// material.specular = new THREE.Color('blue')

// const material = new THREE.MeshToonMaterial();
// material.color = new THREE.Color('lightblue')
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// //this need some light
// //it respects physically concepts, so its the more realistic of all

// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.side = THREE.DoubleSide;
// // material.metalness = 0.65; //dont use this with metalnessMap
// // material.roughness = 0.4; //dont use this with roughnessMap
// doorHeightTexture.minFilter = THREE.NearestFilter;
// doorHeightTexture.magFilter = THREE.NearestFilter;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.03;
// material.metalnessMap = doorMetalnessTexture; //dont use this with material.metalness
// material.roughnessMap = doorRoughnessTexture; //dont use this with material.roughness
// material.normalMap = doorNormalTexture;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// gui.add(material, 'metalness').min(0).max(1).step(0.0001);
// gui.add(material, 'roughness').min(0).max(1).step(0.0001);
// gui.add(material, 'aoMapIntensity').min(0).max(5).step(0.0001);
// gui.add(material,'displacementScale').min(0).max(0.5).step(0.0001);
// gui.add(material.normalScale,'x').min(0).max(1).step(0.0001).name('normalScale.x');
// gui.add(material.normalScale,'y').min(0).max(1).step(0.0001).name('normalScale.y');

//Start of using enviromentMap

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader
    .setPath('/textures/environmentMaps/1/')
    .load([
        'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg'
    ])

scene.background = environmentMapTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;


gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);

//End of using enviromentMap

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material,
);

sphere.position.x = 1.5;
sphere.geometry.setAttribute('uv2', 
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material,
);

plane.geometry.setAttribute('uv2', 
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 64, 128),
    material,
);

torus.geometry.setAttribute('uv2', 
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

torus.position.x = -1.5;
scene.add(sphere, plane, torus);

/**
 * Lights
 */

 const AmbientLight = new THREE.AmbientLight('white', 0.5);
 scene.add(AmbientLight);
 
 const pointLight = new THREE.PointLight('white', 0.5);
 pointLight.position.x = 2
 pointLight.position.y = 3
 pointLight.position.z = 4
 scene.add(pointLight);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /**
     * Animations
     */

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.y = 0.15 * elapsedTime;
    plane.rotation.y = 0.15 * elapsedTime;
    torus.rotation.y = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()