// FRAGMENT
uniform sampler2D uAsciiTexture;
uniform float uAsciiTextureSize;
uniform float uAsciiCharSize;

varying vec3 vColor;
varying vec2 vAsciiUv;
varying float vDisplacementIntensity;
varying float vPictureIntensity;
varying vec2 vUv;

// Function to increase saturation
vec3 increaseSaturation(vec3 color, float saturation)
{
    float intensity = dot(color, vec3(0.3, 0.59, 0.11));
    return mix(vec3(intensity), color, saturation);
}

// Function to adjust brightness and contrast
vec3 adjustBrightnessContrast(vec3 color, float brightness, float contrast)
{
    return (color - 0.5) * contrast + 0.5 + brightness;
}


void main()
{
    // Calculate the UV coordinates for the ASCII texture
    vec2 uv = gl_PointCoord * uAsciiCharSize / uAsciiTextureSize + vAsciiUv;

    // Sample the ASCII texture color
    vec4 asciiColor = texture(uAsciiTexture, uv);

    // Interpolate color based on displacement intensity
    vec3 baseColor = vec3(vUv, 1.0);
    baseColor = increaseSaturation(baseColor, 2.0);

    vec3 elevatedColor = vec3(vec2(1.0 - vUv), 1.0);
    elevatedColor = adjustBrightnessContrast(elevatedColor, 0.001, 2.0);

    vec3 color = mix(baseColor, elevatedColor, vDisplacementIntensity * exp(2.0));

    // Use the alpha channel from the ASCII texture
    gl_FragColor = vec4(color, asciiColor.a * vPictureIntensity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}