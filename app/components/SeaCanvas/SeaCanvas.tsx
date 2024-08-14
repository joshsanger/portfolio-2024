import { useEffect, useRef} from "react";
import * as THREE from "three";
import cn from "classnames";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "~/shaders/sea-vertex.glsl";
import fragmentShader from "~/shaders/sea-fragment.glsl";

export default function SeaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || isMountedRef.current) return;

    isMountedRef.current = true;


    /**
     * Base
     */
    const debugObject = {
      depthColor: "#186691",
      rotationX: Math.PI * 0.5,
      rotationY: 0,
      rotationZ: Math.PI * -0.25,
    };

    // Canvas
    const canvas = canvasRef.current;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 7.5, 100, 100);

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uColorOffset: { value: 0.175 },
      },
    });

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -debugObject.rotationX;
    water.rotation.y = -debugObject.rotationY;
    water.rotation.z = debugObject.rotationZ;
    scene.add(water);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const handleResize = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // if screen is bigger than 2400px set the camera.zoom to 2
      if (sizes.width > 2400 && camera.zoom !== 1.5) {
        camera.zoom = 1.5;
      } else if (sizes.width <= 2400 && camera.zoom !== 1) {
        camera.zoom = 1;
      }
    };
    window.addEventListener("resize", handleResize);

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0.5, 0.5, 0.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure the camera is looking at the center of the scene
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // update time uniform
      waterMaterial.uniforms.uTime.value = elapsedTime;

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "sea-canvas bg-transparent size-full absolute top-0 right-0 z-[-1] animate-reveal-canvas opacity-0",
      )}
    />
  );
}
