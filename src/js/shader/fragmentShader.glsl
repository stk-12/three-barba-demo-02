varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying float vDistortion;

void main() {
  vec2 uv = vUv;

  vec3 COLOR1 = uColor1;
  vec3 COLOR2 = uColor2;

  float distortion = vDistortion * 0.003;

  vec3 color1 = vec3(COLOR1.r + distortion, COLOR1.g + distortion, COLOR1.b + distortion);
  vec3 color2 = vec3(COLOR2.r + distortion, COLOR2.g + distortion, COLOR2.b + distortion);
  vec3 color = mix(color1, color2, sin(uTime * uSpeed * 0.3) * 0.5 + 0.5);

  gl_FragColor = vec4(color, 1.0);
}