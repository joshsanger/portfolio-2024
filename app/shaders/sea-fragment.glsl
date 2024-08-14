uniform vec3 uDepthColor;
uniform float uColorOffset;

varying float vElevation;
varying vec2 vUv;

void main() {

  float mixStrength = (vElevation + uColorOffset) * 3.14;


  // darken the v2v based on color multiplere
  vec3 depth = uDepthColor * (1.0- mixStrength);

  vec3 color = mix(depth, vec3(vUv, 1.0), mixStrength);

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}