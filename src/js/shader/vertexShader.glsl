varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;
uniform float uWave;
uniform float uFrequency;

varying float vDistortion;

#pragma glslify: pnoise = require(glsl-noise/periodic/3d);
#pragma glslify: cnoise = require(glsl-noise/classic/3d);

void main() {
  vUv = uv;
  vec3 pos = position;

  float speed = uTime * uSpeed;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float b = uWave * cnoise(uFrequency * pos + speed * 0.1);

  float displacement = - 10. * b;

  vec3 newPosition = pos + normal * displacement;

  vDistortion = displacement;


  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}