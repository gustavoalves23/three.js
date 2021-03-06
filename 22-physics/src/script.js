import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

scene.add(new THREE.AxesHelper())

/**
 * Sounds
 */

const hitSound = new Audio('/sounds/hit.mp3');

const playHitSound = (strengh, volume) => {
    if (strengh > 1.5) {
        // hitSound.volume = volume
    console.log(volume);
        hitSound.volume = volume
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics Word
 */

const world = new CANNON.World();

//Improving performance

//Broadphase is like the algorith to calculate colides. this improves performance but can cause bugs if an object is moving too fast

world.broadphase = new CANNON.SAPBroadphase(world);

//Sleep is a tool to stop checking if the objects will colide if they are static in place

world.allowSleep = true;

//You can control also sleepSpeedLimit and sleepTimeLimit

//Gravity

world.gravity.set(0, -9.81, 0);

//Materials

// This is one way
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         restitution:0.7,
//         friction: 0.1,
//     }
// )

// world.addContactMaterial(concretePlasticContactMaterial)

//To simplify, we can create an 'default' material, and create anothers if needed.

const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)

world.addContactMaterial(defaultContactMaterial);

world.defaultContactMaterial = defaultContactMaterial;

// //Sphere 

// const sphereShape = new CANNON.Sphere(0.5);

// const sphereBody = new CANNON.Body({
//     mass:1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     //As we set the default world contact material, if we dont provide an material, the body will use the default
//     // material: plasticMaterial
// })

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

// world.addBody(sphereBody);

//Plane

const planeShape = new CANNON.Plane();

const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(planeShape);

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
    //As we set the default world contact material, if we dont provide an material, the body will use the default
    // floorBody.material = concreteMaterial;

world.addBody(floorBody);


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */

const objectsToUpdate = [];

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const SphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

const createSphere = (radius, position) => {

    const mesh = new THREE.Mesh(
        SphereGeometry,
        SphereMaterial,
    )

    mesh.scale.set(radius, radius, radius)


    mesh.castShadow = true;
    mesh.position.copy(position);

    scene.add(mesh);

    const body = new CANNON.Body({
        shape: new CANNON.Sphere(radius),
        mass: 1,
        position: mesh.position,
        material: defaultMaterial
    })

    body.addEventListener('collide', (collision) => playHitSound(collision.contact.getImpactVelocityAlongNormal(), radius / 0.5))

    world.addBody(body);

    objectsToUpdate.push({
        mesh,
        body
    })
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = SphereMaterial;

const createBoxes = (size, position) => {

    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )

    mesh.castShadow = true;
    mesh.scale.set(size, size, size)
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(size / 2,size / 2,size / 2));
    const body = new CANNON.Body({
        shape,
        mass:1,
        position,
    })

    body.addEventListener('collide', (collision) => playHitSound(collision.contact.getImpactVelocityAlongNormal(), size))

    world.addBody(body);

    objectsToUpdate.push({
        mesh,
        body,
    })

}

const debugObject = {
    createSphere: () => {
        createSphere(Math.random() * 0.5, { 
            x: (Math.random() -0.5) * 5, 
            y: Math.random() * 5,
            z: (Math.random() -0.5) * 5,
        })
    },
    createBox: () => {
        createBoxes(Math.random(),
        { 
            x: (Math.random() -0.5) * 5, 
            y: Math.random() * 5,
            z: (Math.random() -0.5) * 5,
        }
        )
    },
    reset: () => {
        objectsToUpdate.forEach((object) => {
            object.body.removeEventListener('colide', playHitSound);
            world.remove(object.body);

            scene.remove(object.mesh)
        })
    }
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')


/**
 * Animate
 */
const clock = new THREE.Clock()

let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const deltaTime = elapsedTime - previousTime;

    previousTime = elapsedTime;

    // Update controls
    controls.update()

    // Update Physics world


    world.step(1 / 60, deltaTime, 3);

    //Updating Positions

    objectsToUpdate.forEach((object) => {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    })


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    
}

tick()