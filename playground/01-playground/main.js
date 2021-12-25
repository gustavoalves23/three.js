import './style.css';
import * as THREE from 'three';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

//scene

const scene = new THREE.Scene();

//camera

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 2;
scene.add(camera);

//renderer

const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(window.innerWidth,window.innerHeight)


// elements

const box = new THREE.Mesh(
  new THREE.SphereGeometry(1,64,32),
  new THREE.MeshBasicMaterial({color: 0x00FF00})
)
scene.add(box);

//animation

const clock = new THREE.Clock();

const tick = () => {
  window.requestAnimationFrame(tick);
  box.rotation.x = clock.getElapsedTime();

  renderer.render(scene, camera);
}

tick()