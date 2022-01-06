import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { Power2 } from 'gsap/all'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)

    })

/**
 * Base
 */

//Texture

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/gradients/3.jpg');
texture.magFilter = THREE.NearestFilter

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const material = new THREE.MeshToonMaterial({color: parameters.materialColor, gradientMap: texture});

const objectsDistance = 4;

const mesh1 = new THREE.Mesh (
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh (
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh (
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

mesh1.position.y = - objectsDistance * 0;
mesh2.position.y = - objectsDistance * 1;
mesh3.position.y = - objectsDistance * 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */

const particlesCount = 2000;

const particlesArray = new Float32Array(particlesCount * 3);

const particlesGeometry = new THREE.BufferGeometry();

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlesArray, 3)
)

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 0.02,
    sizeAttenuation: true
})


for (let i = 0; i < particlesCount * 3; i += 1) {

    const i3 = i * 3;

    particlesArray[i3 + 0] = (Math.random() - 0.5) * 10;
    particlesArray[i3 + 1] = (objectsDistance * 0.5) - Math.random() * objectsDistance * sectionMeshes.length
    particlesArray[i3 + 2] = (Math.random() - 0.5) * 10;
}

const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
)

scene.add(particles);

//Lights

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);

directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

const lightFolder = gui.addFolder('Directional Light');

lightFolder.add(directionalLight, 'intensity').min(0).max(1);
lightFolder.add(directionalLight.position, 'x').min(-5).max(5);
lightFolder.add(directionalLight.position, 'y').min(-5).max(5);
lightFolder.add(directionalLight.position, 'z').min(-5).max(5);


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

//Camera Group (to use parallax)

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameraGroup.add(camera);



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */

 let scrollY = window.scrollY

 let previousSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const actualSection = Math.round(scrollY / sizes.height);

    console.log(actualSection);

    if (actualSection != previousSection) {
        gsap.to(
            sectionMeshes[actualSection].rotation,
            {
                x: sectionMeshes[actualSection].rotation.x +  Math.PI * 2,
                y: sectionMeshes[actualSection].rotation.y +  Math.PI * 2,
                duration: 1,
                ease: Power2.easeInOut,

            }
        )
    }

    previousSection = actualSection

})


/**
 * Mouse position
 */

const mouse = {
    x:0,
    y:0,
}

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width)  - 0.5,
    mouse.y = - (e.clientY / sizes.height) + 0.5
    console.log(mouse);
})

const raycaster = new THREE.Raycaster();

let intersects = raycaster.intersectObject(mesh1);

raycaster.setFromCamera(mouse, camera);


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

    material.color.r = Math.abs(Math.sin(elapsedTime / 10));
    material.color.g = Math.abs(Math.sin(elapsedTime / 10 + 2));
    material.color.b = Math.abs(Math.sin(elapsedTime / 10 + 4));

    console.log(material.color);

    //Animating

    sectionMeshes.forEach((mesh) => {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    })

    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObject(mesh1);

    //Moving Camera

    camera.position.y = - (scrollY / sizes.height) * objectsDistance;
    // scrollY = window.scrollY


    //Parallax

    const ParallaxX = mouse.x * 0.5;
    const ParallaxY = mouse.y * 0.5;

    cameraGroup.position.x += (ParallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (ParallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()