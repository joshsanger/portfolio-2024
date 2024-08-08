import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "~/shaders/vertex.glsl";
import particlesFragmentShader from "~/shaders/fragment.glsl";

export default function CodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /**
     * Base
     */
    // Canvas
    const canvas = canvasRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Loaders
    const textureLoader = new THREE.TextureLoader();

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    };

    const handleResize = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

      if (window.innerWidth < 640) {
        camera.position.set(0, 0, 15);
      } else if (window.innerWidth < 1024) {
        camera.position.set(0, 0, 12);
      } else {
        camera.position.set(0, 0, 8);
      }

      // Materials
      particlesMaterial.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      );

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
    };

    window.addEventListener("resize", handleResize);

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);
    scene.add(camera);

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      // antialias: true
    });
    renderer.setClearColor("black", 0);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    const particleCount = 128;

    /**
     * Displacement
     */
    const displacement = {};

    displacement.canvas = document.createElement("canvas");
    displacement.canvas.width = particleCount;
    displacement.canvas.height = particleCount;
    // displacement.canvas.style.position = 'fixed';
    // displacement.canvas.style.zIndex = 10;
    // displacement.canvas.style.top = 0;
    // displacement.canvas.style.left = 0;
    // displacement.canvas.style.width = '256px';
    // displacement.canvas.style.height = '256px';
    // document.body.append(displacement.canvas);
    displacement.context = displacement.canvas.getContext("2d");

    // make fillstyle a gradient from white to to black

    const gradient = displacement.context.createLinearGradient(
      0,
      0,
      0,
      displacement.canvas.height
    );
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.4, "white");
    displacement.context.fillStyle = gradient;

    displacement.context.fillRect(
      0,
      0,
      displacement.canvas.width,
      displacement.canvas.height
    );
    displacement.context.fillStyle = "black";

    // glow image
    displacement.glowImage = new Image();
    displacement.glowImage.src = "./glow.png";

    // interactibve plane
    displacement.interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );

    displacement.interactivePlane.position.x = 1.1;
    displacement.interactivePlane.rotation.y = Math.PI * -0.2;
    displacement.interactivePlane.visible = false;

    scene.add(displacement.interactivePlane);

    // raycaster
    displacement.raycaster = new THREE.Raycaster();

    // make the default screen cursor position offscreen
    displacement.screenCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

    const handlePointerMove = (event) => {
      displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
      displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);

    /**
     * CANVAS TEXTURE
     */
    displacement.texture = new THREE.CanvasTexture(displacement.canvas);

    /**
     * Particles
     */
    const particlesGeometry = new THREE.PlaneGeometry(
      10,
      10,
      particleCount,
      particleCount
    );

    // dont send data to the GPU that you don't need
    particlesGeometry.setIndex = null;
    particlesGeometry.deleteAttribute("normal");

    // Generate character indices
    const charIndices = new Float32Array(
      particlesGeometry.attributes.position.count
    );
    for (let i = 0; i < charIndices.length; i++) {
      charIndices[i] = Math.floor(Math.random() * 256); // Assuming 256 ASCII characters
    }
    particlesGeometry.setAttribute(
      "aCharIndex",
      new THREE.BufferAttribute(charIndices, 1)
    );

    const asciiTexture = textureLoader.load(
      "./ascii_texture.png",
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      }
    );

    const intensitiesArray = new Float32Array(
      particlesGeometry.attributes.position.count
    );
    const anglesArray = new Float32Array(
      particlesGeometry.attributes.position.count
    );

    // 9000 something iterations
    for (let i = 0; i < intensitiesArray.length; i++) {
      intensitiesArray[i] = Math.random();
      anglesArray[i] = Math.random() * Math.PI * 2;
    }

    particlesGeometry.setAttribute(
      "aIntensity",
      new THREE.BufferAttribute(intensitiesArray, 1)
    );
    particlesGeometry.setAttribute(
      "aAngle",
      new THREE.BufferAttribute(anglesArray, 1)
    );

    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio
          )
        ),
        uPictureTexture: new THREE.Uniform(textureLoader.load("./code3.jpg")),
        uAsciiTexture: new THREE.Uniform(asciiTexture),
        uAsciiTextureSize: new THREE.Uniform(256.0), // Assuming the texture is 256x256 pixels
        uAsciiCharSize: new THREE.Uniform(16.0), // Assuming each character is 16x16 pixels
        uDisplacementTexture: new THREE.Uniform(displacement.texture),
      },
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.x = 1.1;
    particles.rotation.y = Math.PI * -0.2;
    scene.add(particles);

    /**
     * Animate
     */
    const tick = () => {
      // Update controls
      // controls.update();

      /**
       * Raycaster
       */
      displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
      const intersections = displacement.raycaster.intersectObject(
        displacement.interactivePlane
      );

      if (intersections.length) {
        const uv = intersections[0].uv;

        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
      }

      /**
       * Displacement
       */
      displacement.context.globalCompositeOperation = "source-over";
      displacement.context.globalAlpha = 0.015;
      displacement.context.fillRect(
        0,
        0,
        displacement.canvas.width,
        displacement.canvas.height
      );

      // calculate distance between
      const cusorDistance = displacement.canvasCursorPrevious.distanceTo(
        displacement.canvasCursor
      );

      // previous position
      displacement.canvasCursorPrevious.copy(displacement.canvasCursor);

      // alpha
      const alpha = Math.min(cusorDistance * 0.1, 1);

      // draw glow
      const glowSize = displacement.canvas.width * 0.35;

      displacement.context.globalAlpha = alpha;
      displacement.context.globalCompositeOperation = "lighten";
      displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
      );

      displacement.texture.needsUpdate = true;

      // make random letters change every 1 second (only 100 random letters at a time)
      // const charIndices = particlesGeometry.attributes.aCharIndex.array;
      // for (let i = 0; i < 25; i++) {
      //     charIndices[Math.floor(Math.random() * charIndices.length)] = Math.floor(Math.random() * 256);
      // }

      // particlesGeometry.attributes.aCharIndex.needsUpdate = true;

      // move up and down every 2 seconds
      // particles.rotation.y = Math.sin(Date.now() * 0.001) * -0.1;

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };
    tick();
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-transparent size-full fixed top-0 right-0 z-[-1]"
    />
  )
}
