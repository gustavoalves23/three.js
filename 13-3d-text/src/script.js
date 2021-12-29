import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {  FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load('/textures/matcaps/8.png');

/**
 * Font
 */

const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3,
            }
        )
        // const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
        const material = new THREE.MeshNormalMaterial();
        const TextMesh = new THREE.Mesh(textGeometry, material);

        //One way of centering (hard way ,but good for understanding some topics)
    //     textGeometry.computeBoundingBox();
    //    textGeometry.translate(
    //        - (textGeometry.boundingBox.max.x - 0.02) / 2,
    //        - (textGeometry.boundingBox.max.y - 0.02) / 2,
    //        - (textGeometry.boundingBox.max.z - 0.03) / 2
    //    )

        //Second way. It does exactly what first way does, but automaticaly
        textGeometry.center();

        scene.add(TextMesh);

        console.time('start');

//When using a loop, if is the same geometry and material, put them outside the loop. Thats a giant performance improvement

        const geometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

        for (let index = 0; index < 1000; index += 1) {

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 20 ,
                (Math.random() - 0.5) * 20 ,
                (Math.random() - 0.5) * 20 ,
            )

            mesh.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                0
            )

            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random()
            scene.add(mesh);
        }

        console.timeEnd('start')
    }
);

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

console.log(camera.uuid);

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

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()