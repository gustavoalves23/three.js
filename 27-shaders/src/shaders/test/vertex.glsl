precision mediump float;

//Those commented are automatically inserted by three.js if you set the material as ShaderMaterial instead of RawShaderMaterial
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// attribute vec2 uv;

uniform float uTimeStamp;
uniform vec2 uFrequency;

varying vec2 vUv;
varying float vElevation;

void main() {

  int a = 1;
  int b = 2;
  float c = float(a)/float(b);

  vec2 vector2 = vec2(1.0, 2.0);
  vec3 vector3 = vec3(vector2, 1.0);

  // vRandom = aRandom;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vUv = uv;

  // modelPosition.z = aRandom * 0.1;

  modelPosition.z = (sin((modelPosition.x * uFrequency.x + - uTimeStamp)) + sin((modelPosition.y * uFrequency.y + - uTimeStamp))) * 0.1;

  vElevation = modelPosition.z;
 
  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}