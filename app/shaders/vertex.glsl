uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uAsciiTexture;
uniform float uAsciiTextureSize;
uniform float uAsciiCharSize;
uniform sampler2D uDisplacementTexture;

attribute float aCharIndex;
attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;
varying vec2 vAsciiUv;

void main()
{
    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.7, displacementIntensity);

    // direction
    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1
    );

    displacement = normalize(displacement);

    displacement *= displacementIntensity;
    displacement *= 2.0;
    displacement *= aIntensity;
    newPosition += displacement;

    // lets add some randomness


    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture texture
    float uPictureTexture = texture(uPictureTexture, uv).r;

    // Point size
    gl_PointSize = 0.2 * uPictureTexture * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // ASCII texture UV calculation
    float charPerRow = uAsciiTextureSize / uAsciiCharSize;
    float charX = mod(aCharIndex, charPerRow);
    float charY = floor(aCharIndex / charPerRow);
    vAsciiUv = vec2(charX, charY) * uAsciiCharSize / uAsciiTextureSize;

    // varryings
    vColor = vec3(pow(uPictureTexture, 2.0));
}