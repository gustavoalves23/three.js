import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


//Animations


/**
 * Time Way
 * let time = Date.now();
 * this is needed to compare between two diff timestamps
 */

/**
 * Clock Way
 * const clock = new THREE.Clock();
 * this is needed to instanciate an new Clock, to see how much time passed.
 */

/**
 * GSAP
 * this call dont need to be inside our tick function because it has it own tick and requestAnimationFrame call.
 * ******** IMPORTANT ********
 * it updates the attributes by itself, but it don`t re-render for you, so you will still need the tick funcion the re-run the render funcion
 */

gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    x: 2
});

gsap.to(mesh.position, {
    duration: 1,
    delay: 2,
    x: 0
});



const tick = () => {
    window.requestAnimationFrame(tick);
    // the function requestAnimationFrame calls an callback on the next frame. So, if you put tick as a callback of requestAnimationFrame, we will do something every single frame.
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;

    /**
     * Time
     * To resolve an problem that, depending on the monitor framerate, an animation can happen wrong (if you have an higher framerate, an object can be moved more than wanted faster than wanted)
     * we will use timestamps from Date.now()
     *  const currentTime = Date.now();
        const deltaTime = currentTime - time;
        time = currentTime;
        mesh.rotation.y += 0.001 * deltaTime;
     *

    /**
     * Clock
     * Clock in an internal Three.js to the same problem that Time resolves.
     *  mesh.position.y = Math.sin(clock.getElapsedTime());
        mesh.position.x = Math.cos(clock.getElapsedTime());
        camera.lookAt(mesh.position);
     */


    /**
     * External library GSAP (The way we will use)
     * its an more robust way, allowing you to customize and create more advanced things, like interpolation of different times.
     * npm install --save gsap@3.5.1
     * more details above
     */




    renderer.render(scene, camera);
}

tick();
