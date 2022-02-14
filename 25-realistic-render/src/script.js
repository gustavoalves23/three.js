import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
    envMapIntensity: 5,
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */


const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
            // child.material.roughness = 0;
        }
    })
}


//Loaders
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);

// gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//     const content = [...gltf.scene.children];
//     content.forEach((c) => scene.add(c))
// })

const cubeTextureLoader = new THREE.CubeTextureLoader();


/**
 * Environment Maps
 */

 const environmentMap = cubeTextureLoader.setPath('./textures/environmentMaps/0/')
 .load([
     'px.jpg',
     'nx.jpg',
     'py.jpg',
     'ny.jpg',
     'pz.jpg',
     'nz.jpg',
 ]);

 environmentMap.encoding = THREE.sRGBEncoding;
  //To make things look realistic, we use sRGBEncoding on every visible texture, like color texture and envMap texture,
  // In this case, we dont need to use it on the helmet color textures because GLTFLoader do this for us.

 scene.background = environmentMap;

 /**
  * Models
  */

//   gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     gltf.scene.rotation.y = Math.PI / 2;
//     scene.add(gltf.scene);

//     const HelmetGUI = gui.addFolder('Helmet');
//     HelmetGUI.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('Rotation Y');
//     HelmetGUI.add(debugObject, 'envMapIntensity').min(0).max(20).step(0.001).onChange(updateAllMaterials);
// updateAllMaterials()
// })

  gltfLoader.load('./models/hamburger.glb', (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, -4, 0);
    gltf.scene.rotation.y = Math.PI / 2;
    scene.add(gltf.scene);

    const HelmetGUI = gui.addFolder('Helmet');
    HelmetGUI.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('Rotation Y');
    HelmetGUI.add(debugObject, 'envMapIntensity').min(0).max(20).step(0.001).onChange(updateAllMaterials);
updateAllMaterials()
})

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
camera.position.set(4, 1, - 4)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);

scene.add(lightHelper);

const updateHelper = () => {
    lightHelper.update()
}

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('LightIntensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX').onChange(updateHelper);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY').onChange(updateHelper);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ').onChange(updateHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.physicallyCorrectLights = true;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * There is something called HDR, with allows RGB scales to go beyong 1. There is something called toneMap that can scale it to SDR using different algorythims,
 * Our textures are not in HDR, but we will use it in a wrong way because it will looks great anyway
 */

renderer.toneMapping  = THREE.ReinhardToneMapping;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(updateAllMaterials)

gui.add(renderer, 'toneMappingExposure').min(0).max(10);

/**
 * lights
 */

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 8;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.mapSize.width = 1024;

//To fix some strange shadow lines you can apply normal BIAS
//More about that on end of lesson

directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

const directionalLightGUI = gui.addFolder('directionalLight');
directionalLightGUI.addColor(directionalLight, 'color');
directionalLightGUI.add(directionalLight, 'intensity').min(0).max(5).step(0.01);
directionalLightGUI.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
directionalLightGUI.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
directionalLightGUI.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

/**
 * Animate
 */


const tick = () =>
{

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()