"use client";

import { ContactShadows } from "@react-three/drei";

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight
        castShadow
        position={[3.5, 6, 3]}
        intensity={1.7}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-3, 4, -4]} intensity={0.45} color="#d9b573" />
      <ContactShadows
        opacity={0.38}
        scale={10}
        blur={2.2}
        far={4}
        resolution={1024}
        color="#130d09"
      />
    </>
  );
}
