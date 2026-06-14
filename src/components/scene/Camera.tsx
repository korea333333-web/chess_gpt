"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { fixedCameraControls, fixedCameraView } from "@/lib/scene/camera";

export function Camera() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={fixedCameraView.position}
        fov={fixedCameraView.fov}
      />
      <OrbitControls
        enablePan={fixedCameraControls.enablePan}
        enableRotate={fixedCameraControls.enableRotate}
        enableZoom={fixedCameraControls.enableZoom}
        target={fixedCameraView.target}
      />
    </>
  );
}
