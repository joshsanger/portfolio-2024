import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import cn from "classnames";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "~/shaders/vertex.glsl";
import particlesFragmentShader from "~/shaders/fragment.glsl";

export default function CodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const isMountedRef = useRef(false);


  useEffect(() => {
    if (!canvasRef.current || isMountedRef.current) return;

    isMountedRef.current = true;

    let texturesLoaded = 0;
    const totalTextures = 2;

    const checkIfReady = () => {
      texturesLoaded += 1;
      if (texturesLoaded === totalTextures) {
        // All assets are loaded, set the scene as ready
        setIsSceneReady(true);
        tick();
        handleResize();
      }
    };

    /**
     * Base
     */
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
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
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

      if (window.innerWidth < 520) {
        camera.position.set(0.75, -3.25, 25);
        displacement.interactivePlane.position.x = 0.75;
        displacement.interactivePlane.rotation.y = Math.PI * -0.1;
        particles.position.x = 0.75;
        particles.rotation.y = Math.PI * -0.1;
      } else if (window.innerWidth < 1024) {
        camera.position.set(0, 0, 12);
      } else {
        camera.position.set(0, 0, 8);
      }

      particlesMaterial.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      );

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
    };

    window.addEventListener("resize", handleResize);

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setClearColor("black", 0);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    const particleCount = 124;

    /**
     * Displacement
     */
    const displacement = {
      canvas: document.createElement("canvas"),
      glowImage: new Image(),
      interactivePlane: new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ color: 0xff0000})
      ),
      raycaster: new THREE.Raycaster(),
      screenCursor: new THREE.Vector2(9999, 9999),
      canvasCursor: new THREE.Vector2(9999, 9999),
      canvasCursorPrevious: new THREE.Vector2(9999, 9999),
    };

    displacement.canvas.width = particleCount;
    displacement.canvas.height = particleCount;
    const context = displacement.canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, displacement.canvas.height);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.4, "white");
    context.fillStyle = gradient;
    context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);
    context.fillStyle = "black";

    displacement.glowImage.src = "./glow.png";
    displacement.interactivePlane.position.x = 1.1;
    displacement.interactivePlane.rotation.y = Math.PI * -0.2;
    displacement.interactivePlane.visible = false;
    scene.add(displacement.interactivePlane);

    /**
     * Event Handlers
     */
    const handlePointerMove = (event) => {
      displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
      displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        displacement.screenCursor.x = (touch.clientX / sizes.width) * 2 - 1;
        displacement.screenCursor.y = -(touch.clientY / sizes.height) * 2 + 1;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove);

    /**
     * CANVAS TEXTURE
     */
    displacement.texture = new THREE.CanvasTexture(displacement.canvas);

    /**
     * Particles
     */
    const particlesGeometry = new THREE.PlaneGeometry(10, 10, particleCount, particleCount);
    particlesGeometry.setIndex = null;
    particlesGeometry.deleteAttribute("normal");

    const charIndices = new Float32Array(particlesGeometry.attributes.position.count);
    for (let i = 0; i < charIndices.length; i++) {
      charIndices[i] = Math.floor(Math.random() * 64);
    }
    particlesGeometry.setAttribute(
      "aCharIndex",
      new THREE.BufferAttribute(charIndices, 1)
    );

    const asciiTexture = textureLoader.load("./transparent-ibm.png", (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = false;

      checkIfReady();
    });

    const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count);
    const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);

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
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio
          )
        ),
        uPictureTexture: new THREE.Uniform(textureLoader.load("./code3.jpg", checkIfReady)),
        uAsciiTexture: new THREE.Uniform(asciiTexture),
        uAsciiTextureSize: new THREE.Uniform(256.0),
        uAsciiCharSize: new THREE.Uniform(32.0),
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
      displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
      const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane);

      if (intersections.length) {
        const uv = intersections[0].uv;
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
      }

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.015;
      context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

      const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor);
      displacement.canvasCursorPrevious.copy(displacement.canvasCursor);

      const alpha = Math.min(cursorDistance * 0.1, 1);
      const glowSize = displacement.canvas.width * 0.35;

      context.globalAlpha = alpha;
      context.globalCompositeOperation = "lighten";
      context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
      );

      displacement.texture.needsUpdate = true;

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);

      // dispose
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('code-canvas bg-transparent size-full absolute top-0 right-0 z-[-1] transition-opacity duration-[1.1s]', isSceneReady ? 'opacity-100' : 'opacity-0')}
    />
  )
}
