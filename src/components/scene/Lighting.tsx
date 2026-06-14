"use client";

import { ContactShadows } from "@react-three/drei";
import {
  ambientLightConfig,
  backLightConfig,
  blackPieceFillLightConfig,
  contactShadowConfig,
  keyLightConfig
} from "@/lib/scene/lightingConfig";

export function Lighting() {
  return (
    <>
      <ambientLight intensity={ambientLightConfig.intensity} />
      <directionalLight
        castShadow
        color={keyLightConfig.color}
        position={keyLightConfig.position}
        intensity={keyLightConfig.intensity}
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        castShadow
        angle={backLightConfig.angle}
        color={backLightConfig.color}
        intensity={backLightConfig.intensity}
        penumbra={backLightConfig.penumbra}
        position={backLightConfig.position}
        target-position={[0, 0.2, -2.4]}
      />
      <pointLight
        position={blackPieceFillLightConfig.position}
        intensity={blackPieceFillLightConfig.intensity}
        color={blackPieceFillLightConfig.color}
      />
      <pointLight position={[-3, 4, -4]} intensity={0.42} color="#d9b573" />
      <ContactShadows
        opacity={contactShadowConfig.opacity}
        scale={contactShadowConfig.scale}
        blur={contactShadowConfig.blur}
        far={contactShadowConfig.far}
        resolution={contactShadowConfig.resolution}
        color={contactShadowConfig.color}
      />
    </>
  );
}
