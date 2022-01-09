import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { degToRad } from 'three/src/math/MathUtils';

/**
 * Basic Setup
 */

//Canvas

const canvas = document.getElementsByClassName("webgl")[0];

//Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Scene

const scene = new THREE.Scene();

//Camera

const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.y = 5;

//Orbit Controls

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

//Renderer

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap


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


//Objects

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    // color: 'red',
    metalness: 0.8,
    roughness: 0.3,
  })
)

ground.receiveShadow = true;

ground.rotation.x = - Math.PI / 2;
ground.position.y = - 0.65;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({
  })
)

sphere.position.y = -0.65;

sphere.castShadow = true;

scene.add(ground, sphere);

for (let i = 0; i < 8; i+= 1) {

  const torusGeometry = new THREE.TorusGeometry(1, 0.11, 32, 32);
  const torusMaterial = new THREE.MeshBasicMaterial({color: 'blue'})

  const torus = new THREE.Mesh (
    torusGeometry,
    torusMaterial
  );

  const radius = 5;

  torus.position.z = Math.sin(Math.PI * 2 * i / 8) * radius;
  torus.position.x = Math.cos(Math.PI * 2 * i / 8) * radius;

  torus.rotation.y =  - degToRad(360 * i / 8)

  scene.add(torus);

}

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  1024,
  {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipMapLinearFilter
  }
)

const mirrorCamera = new THREE.CubeCamera(1, 10, cubeRenderTarget);


scene.add(mirrorCamera);


const smallSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  new THREE.MeshLambertMaterial({
    color: 0xffffff,
    envMap: cubeRenderTarget.texture,
  })
)

smallSphere.position.set(5, 0, 2);

smallSphere.visible = false;

mirrorCamera.position.copy(smallSphere.position);

mirrorCamera.update(renderer, scene)

smallSphere.visible = true;

scene.add(smallSphere);


//Lights

const spotLight = new THREE.SpotLight(0xFFFFFF, 1, 15, 50, 1);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);

spotLight.position.y = 5;


spotLight.target.position.copy(smallSphere.position);

scene.add(spotLight.target);

scene.add(spotLight, spotLightHelper);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);

scene.add(ambientLight)





//Tick

const clock = new THREE.Clock();

const tick = () => {

  const elapsedTime = clock.getElapsedTime();
  console.log("🚀 ~ file: main.js ~ line 141 ~ tick ~ elapsedTime", elapsedTime)

  spotLight.target.position.copy(smallSphere.position);
  spotLightHelper.update()

  control.update();

  //Small Ball animation

  smallSphere.position.x = Math.sin(elapsedTime / 4) * 5;
  smallSphere.position.z = Math.cos(elapsedTime / 4) * 5;

mirrorCamera.position.copy(smallSphere.position);

mirrorCamera.update(renderer, scene)

camera.lookAt(smallSphere.position)

renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();