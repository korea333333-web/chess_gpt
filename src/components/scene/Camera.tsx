"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export function Camera() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 7.2, 7.6]} fov={42} />
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={11}
        minPolarAngle={0.45}
        maxPolarAngle={1.05}
        target={[0, 0, 0]}
      />
    </>
  );
}
