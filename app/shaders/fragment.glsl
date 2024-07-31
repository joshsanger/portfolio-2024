uniform sampler2D uAsciiTexture;
uniform float uAsciiTextureSize;
uniform float uAsciiCharSize;

varying vec3 vColor;
varying vec2 vAsciiUv;

void main()
{
    vec2 uv = gl_PointCoord * uAsciiCharSize / uAsciiTextureSize + vAsciiUv;

    vec4 asciiColor = texture(uAsciiTexture, uv);

    // Discard pixels that are not white
    if (asciiColor.r < 0.9 && asciiColor.g < 0.9 && asciiColor.b < 0.9) {
        discard;
    }

    gl_FragColor = vec4(vColor * asciiColor.rgb, asciiColor.a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}