import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



//Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//scene

const scene = new THREE.Scene();

//camera

const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 2000);

camera.position.z = 5;
camera.position.x = 20;


//renderer

const canvas = document.querySelector('canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Camera Control

const controlCamera = new OrbitControls(camera, canvas);

renderer.setSize(sizes.width, sizes.height);

//Window Resize

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
})

//Objects


const geometry = new THREE.BufferGeometry();

const values = {
  triangles: 1000,
  loops: 1,
  multiplier: 5,
  width: 20,
}

const triangles = values.triangles;

const offset = 0.09;

const array = new Float32Array( triangles * 3 * 3);

let actualOffset = 0;

for (let i = 0; i < triangles * 3 * 3; i += 18) {
  array[i] = actualOffset;
  array[i + 1] = - values.width/2;
  
  array[i + 3] = actualOffset;
  array[i + 4] = values.width/2;

  array[i + 6] = actualOffset + offset;
  array[i + 7] = - values.width/2;

  array[i + 9] = actualOffset + offset;
  array[i + 10] = values.width/2;

  array[i + 12] = actualOffset;
  array[i + 13] = values.width/2;
  
  array[i + 15] = actualOffset + offset;
  array[i + 16] = -values.width/2;

  actualOffset += offset;
}


// array[8] = 0.05;
// array[11] = 0.05;
// array[17] = 0.05;
// array[20] = 0.05;
// array[23] = 0.05;
// array[32] = 0.05;
// array[35] = 0.05

const generateSin = () => {
  geometry.dispose();
  for (let i = 8; i < triangles * 9 - 6; i += 18) {
    const sin = Math.sin((Math.PI * 2 * i * values.loops)/(triangles * 9 - 6)) * values.multiplier
    array[i] = sin;
    array[i + 3] = sin;
    array[i + 9] = sin;
    array[i + 12] = sin;
    array[i + 15] = sin;
    array[i + 24] = sin;
  }
}

generateSin();

geometry.setAttribute('position', new THREE.BufferAttribute(array, 3));


const material = new THREE.MeshBasicMaterial({color: 0xFF6622, wireframe: true})
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = -((triangles/2 * offset) / 2)

scene.add(mesh);

//Tick

const clock = new THREE.Clock();

const tick = () => {
  renderer.render(scene, camera);
  // mesh.rotation.x = clock.getElapsedTime()/2



  window.requestAnimationFrame(tick);
}

tick();
