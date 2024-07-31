import React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats, Text } from "@react-three/drei";

export default function Three() {
  return (
    <Canvas style="">
      <pointLight position={[5, 5, 5]} />
      <Text
        scale={[10, 10, 5]}
        color="#606060" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        &lt;/&gt;
      </Text>
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}
