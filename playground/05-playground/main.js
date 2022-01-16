import * as THREE from 'three';
import './style.css'
import gsap from 'gsap';


/**
 * Basic Setup
 */

//Canvas

const canvas = document.getElementsByTagName('canvas')[0];

//Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Scene

const scene = new THREE.Scene();

//Camera

const camera = new THREE.OrthographicCamera(
  -10,
  10,
  10,
  -10
)

camera.position.z = 5;
//Renderer

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);


renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));


//Resize

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//Particles

const testbox = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
)

//Mouse Position

const mouse = {
  x: 0,
  y: 0,
}

window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y =  - (e.clientY / sizes.height) * 2 + 1;
})

//Raycaster

const raycaster = new THREE.Raycaster();

raycaster.setFromCamera(mouse, camera);

scene.add(testbox);

//Tick

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  gsap.to(testbox.position,{
    x: mouse.x * 10,
    y: mouse.y * 10,
    duration: 0.5,
  })

  console.log(testbox.position.x);

}

tick();