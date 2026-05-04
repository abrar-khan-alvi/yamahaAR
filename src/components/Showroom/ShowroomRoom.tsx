'use client';

import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/* ── Shared wall material colours ─────────────────── */
const WALL_COLOR   = '#f7f7f7';
const WALL_ROUGHNESS = 0.92;

/* ── Glass material for windows / door panes ──────── */
function GlassMaterial() {
  return (
    <meshPhysicalMaterial
      color="#cce8ff"
      transmission={0.88}
      roughness={0.05}
      metalness={0}
      ior={1.4}
      thickness={0.12}
      transparent
      opacity={0.35}
      side={THREE.DoubleSide}
    />
  );
}

/* ── Single window unit ──────────────────────────────
   A white frame + glass pane, reusable anywhere.
   w / h = outer frame dimensions
─────────────────────────────────────────────────── */
function Window({
  position,
  rotation,
  w = 2.4,
  h = 1.8,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  w?: number;
  h?: number;
}) {
  const frameT = 0.08;   // frame thickness
  return (
    <group position={position} rotation={rotation}>
      {/* Glass pane */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w - frameT * 2, h - frameT * 2]} />
        <GlassMaterial />
      </mesh>

      {/* Outer white frame — top */}
      <mesh position={[0, h / 2 - frameT / 2, 0]}>
        <boxGeometry args={[w, frameT, 0.12]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      {/* bottom */}
      <mesh position={[0, -(h / 2 - frameT / 2), 0]}>
        <boxGeometry args={[w, frameT, 0.12]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      {/* left */}
      <mesh position={[-(w / 2 - frameT / 2), 0, 0]}>
        <boxGeometry args={[frameT, h, 0.12]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      {/* right */}
      <mesh position={[(w / 2 - frameT / 2), 0, 0]}>
        <boxGeometry args={[frameT, h, 0.12]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      {/* Centre divider (cross-bar) */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[frameT, h, 0.08]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w, frameT, 0.08]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>

      {/* Subtle light glow — sunlight coming through */}
      <pointLight position={[0, 0, 1]} intensity={3} color="#d8eeff" distance={6} decay={2} />
    </group>
  );
}

/* ── Double glass door ───────────────────────────────
   Two panels side-by-side with frame and handle.
─────────────────────────────────────────────────── */
function GlassDoor({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const doorW = 1.0;
  const doorH = 3.0;
  const frameT = 0.1;

  return (
    <group position={position} rotation={rotation}>
      {/* Left panel */}
      <group position={[-doorW / 2 - frameT / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[doorW - 0.12, doorH - 0.12]} />
          <GlassMaterial />
        </mesh>
        {/* Frame */}
        <mesh position={[0, doorH / 2, 0]}>
          <boxGeometry args={[doorW, frameT, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, -doorH / 2, 0]}>
          <boxGeometry args={[doorW, frameT, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[-doorW / 2, 0, 0]}>
          <boxGeometry args={[frameT, doorH, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[doorW / 2, 0, 0]}>
          <boxGeometry args={[frameT, doorH, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[doorW / 2 - 0.15, 0, 0.08]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 12]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Right panel */}
      <group position={[doorW / 2 + frameT / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[doorW - 0.12, doorH - 0.12]} />
          <GlassMaterial />
        </mesh>
        <mesh position={[0, doorH / 2, 0]}>
          <boxGeometry args={[doorW, frameT, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, -doorH / 2, 0]}>
          <boxGeometry args={[doorW, frameT, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[-doorW / 2, 0, 0]}>
          <boxGeometry args={[frameT, doorH, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[doorW / 2, 0, 0]}>
          <boxGeometry args={[frameT, doorH, 0.1]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[-doorW / 2 + 0.15, 0, 0.08]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 12]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Top transom frame */}
      <mesh position={[0, doorH / 2 + frameT / 2, 0]}>
        <boxGeometry args={[doorW * 2 + frameT * 2, frameT, 0.14]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Door sill */}
      <mesh position={[0, -doorH / 2 - frameT / 2, 0.06]}>
        <boxGeometry args={[doorW * 2 + frameT * 2, frameT, 0.22]} />
        <meshStandardMaterial color="#cccccc" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* ── Promotional banner (texture on back wall) ───── */
function PromoBanner({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const texture = useTexture('/images/yamaha_eid_banner.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} rotation={rotation}>
      {/* Shadow backing frame */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[7.2, 2.8, 0.06]} />
        <meshStandardMaterial color="#001a33" roughness={0.8} />
      </mesh>
      {/* Banner plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[7.0, 2.65]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Subtle blue spotlight on the banner */}
      <pointLight position={[0, 1, 1.5]} intensity={4} color="#005BAC" distance={5} decay={2} />
    </group>
  );
}

/* ── Main room geometry ──────────────────────────── */
interface ShowroomRoomProps {
  isMobile: boolean;
}

export default function ShowroomRoom({ isMobile }: ShowroomRoomProps) {
  const WALL_H  = 7.0;   // room height
  const BACK_Z  = -9.5;  // back wall Z
  const SIDE_X  = 13.0;  // side wall X (left = -13, right = +13)
  const ROOM_D  = 28.0;  // depth front to back
  const ROOM_W  = 26.0;  // width

  return (
    <>
      {/* ── BACK WALL ────────────────────────────── */}
      <mesh position={[0, WALL_H / 2, BACK_Z]} receiveShadow>
        <planeGeometry args={[ROOM_W, WALL_H]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={WALL_ROUGHNESS} />
      </mesh>

      {/* Yamaha blue skirting on back wall bottom */}
      <mesh position={[0, 0.15, BACK_Z + 0.02]}>
        <planeGeometry args={[ROOM_W, 0.30]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>
      {/* Yamaha blue cornice stripe at top of back wall */}
      <mesh position={[0, WALL_H - 0.18, BACK_Z + 0.02]}>
        <planeGeometry args={[ROOM_W, 0.36]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>

      {/* Promotional banner — centre of back wall */}
      <PromoBanner
        position={[0, 3.4, BACK_Z + 0.05]}
      />

      {/* ── LEFT WALL ────────────────────────────── */}
      <mesh position={[-SIDE_X, WALL_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, WALL_H]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={WALL_ROUGHNESS} />
      </mesh>

      {/* Left wall windows (2 windows) */}
      {!isMobile && (
        <>
          <Window position={[-SIDE_X + 0.08, 3.4, -2.5]} rotation={[0, Math.PI / 2, 0]} />
          <Window position={[-SIDE_X + 0.08, 3.4, 3.5]}  rotation={[0, Math.PI / 2, 0]} />
        </>
      )}
      {isMobile && (
        <Window position={[-SIDE_X + 0.08, 3.4, 0.5]} rotation={[0, Math.PI / 2, 0]} />
      )}

      {/* Left wall blue accents */}
      <mesh position={[-SIDE_X + 0.02, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, 0.30]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>
      <mesh position={[-SIDE_X + 0.02, WALL_H - 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, 0.36]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>

      {/* ── RIGHT WALL ───────────────────────────── */}
      <mesh position={[SIDE_X, WALL_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, WALL_H]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={WALL_ROUGHNESS} />
      </mesh>

      {/* Right wall window + door */}
      {!isMobile && (
        <>
          <Window position={[SIDE_X - 0.08, 3.4, -3.5]} rotation={[0, -Math.PI / 2, 0]} />
          <GlassDoor position={[SIDE_X - 0.08, 1.52, 3.0]} rotation={[0, -Math.PI / 2, 0]} />
        </>
      )}
      {isMobile && (
        <Window position={[SIDE_X - 0.08, 3.4, -0.5]} rotation={[0, -Math.PI / 2, 0]} />
      )}

      {/* Right wall blue accents */}
      <mesh position={[SIDE_X - 0.02, 0.15, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, 0.30]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>
      <mesh position={[SIDE_X - 0.02, WALL_H - 0.18, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, 0.36]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>

      {/* ── CEILING ──────────────────────────────── */}
      <mesh position={[0, WALL_H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f0f0f0" roughness={1} />
      </mesh>

      {/* Ceiling LED strip lights (emissive planes — no extra light object needed) */}
      {[-4, 0, 4].map((x) => (
        <mesh key={x} position={[x, WALL_H - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, ROOM_D * 0.7]} />
          <meshBasicMaterial color="#fffaec" />
        </mesh>
      ))}
    </>
  );
}
