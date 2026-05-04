import { useGLTF } from '@react-three/drei';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import { MeshoptDecoder } from 'meshoptimizer';

interface BikeModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  onSelect?: () => void;
}

function cloneMat(m: THREE.Material): THREE.Material {
  const c = m.clone();
  if (c instanceof THREE.MeshStandardMaterial) {
    c.envMapIntensity = 1.5;
    const n = c.name.toLowerCase();
    if (n.includes('paint') || n.includes('body') || n.includes('frame')) {
      c.roughness = 0.15;
      c.metalness = 0.85;
    }
  }
  return c;
}

export default function BikeModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onSelect,
}: BikeModelProps) {
  // Use GLTF with Draco and Meshopt decoders
  const { scene } = useGLTF(url, true, true, (loader) => {
    // Set Meshopt decoder for models simplified in gltf.report
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const groupRef = useRef<Group>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      // Preserve original type: single mat → single mat, array → array
      if (Array.isArray(child.material)) {
        child.material = child.material.map(cloneMat);
      } else {
        child.material = cloneMat(child.material);
      }
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return c;
  }, [scene]);

  // After mount the group is live in the scene — compute world-space bounding box
  // and snap the bike's lowest point to Y=0 (the floor plane).
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Ensure all matrices are current before sampling the box
    group.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(group);

    if (!box.isEmpty() && isFinite(box.min.y) && box.min.y < 0) {
      group.position.y -= box.min.y; // lift exactly so bottom == Y 0
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clone]); // re-run if the model changes

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload('/models/yamaha_yzf-r3_2017.glb');
useGLTF.preload('/models/yamaha_dt_125_repainted.glb');
useGLTF.preload('/models/yamaha_500_custom_motorbike.glb');
useGLTF.preload('/models/vino.glb');
