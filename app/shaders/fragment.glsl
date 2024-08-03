// FRAGMENT
uniform sampler2D uAsciiTexture;
uniform float uAsciiTextureSize;
uniform float uAsciiCharSize;

varying vec3 vColor;
varying vec2 vAsciiUv;
varying float vDisplacementIntensity; // Add this line
varying float vPictureIntensity; // Add this line
varying vec2 vUv;

void main()
{
    vec2 uv = gl_PointCoord * uAsciiCharSize / uAsciiTextureSize + vAsciiUv;

    vec4 asciiColor = texture(uAsciiTexture, uv);

    // Discard pixels that are not white
    if (asciiColor.r < 0.9 && asciiColor.g < 0.9 && asciiColor.b < 0.9) {
        discard;
    }

    // Discard particles that are not part of the picture
    if (vPictureIntensity < 0.1) {
        discard;
    }

    // Interpolate color based on displacement intensity
    vec3 color = mix(vec3(vUv, 1), vec3(1.0, 1.0, 1.0), vDisplacementIntensity);

    gl_FragColor = vec4(color, asciiColor.a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}