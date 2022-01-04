import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */

const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    afinamento: false,
}

let particlesGeometry, particlesMaterial, particles = null;

// scene.add (
//     new THREE.AxesHelper()
// )



const generateGalaxy = () => {

    /**
 * Particles
 */

    if (particles !== null) {
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        scene.remove(particles);
    }


    const particlesPositionArray = new Float32Array(parameters.count * 3);
    const particlesColorArray = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);


        for (let index = 0; index < parameters.count * 3; index += 1) {
         
        const actualBranch = index % parameters.branches;


        const branchAngle = Math.PI * 2 * actualBranch/parameters.branches;
        
        const i3 = index * 3;

        const radius = parameters.radius * Math.random();

        const mixedColor = colorInside.clone();

        mixedColor.lerp(colorOutside, radius/parameters.radius);

        const spinAngle = radius * parameters.spin;

        //Afinamento

        const afinamento = (parameters.radius - radius)/parameters.radius;


        const randomX = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)) * (parameters.afinamento ? afinamento : 1);
        const randomY = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)) * (parameters.afinamento ? afinamento : 1);
        const randomZ = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)) * (parameters.afinamento ? afinamento : 1);



        particlesPositionArray[i3 + 0] = Math.sin(branchAngle + spinAngle) * radius + randomX
        particlesPositionArray[i3 + 1] = randomY * Math.random() ** 2
        particlesPositionArray[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

        particlesColorArray[i3 + 0] = mixedColor.r;
        particlesColorArray[i3 + 1] = mixedColor.g;
        particlesColorArray[i3 + 2] = mixedColor.b;
    };


    particlesGeometry = new THREE.BufferGeometry();


    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPositionArray, 3)
    )

    particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(particlesColorArray, 3)
    )



    particlesMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles);


}

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'afinamento').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

generateGalaxy();

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    //Animation

    particles.rotation.y = - elapsedTime * 0.05

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()