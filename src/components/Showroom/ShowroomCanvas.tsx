'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html, Bvh, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import BikeModel from './BikeModel';
import ShowroomRoom from './ShowroomRoom';
import type { Bike } from '@/lib/bikeData';

/* ─────────────────────────────────────────────
   Display podium — white cylinder platform under each bike
   On mobile we skip this to save draw calls.
───────────────────────────────────────────── */
function DisplayPodium({ position, isMobile }: { position: [number, number, number]; isMobile: boolean }) {
  if (isMobile) return null;
  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Raised platform */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.08, 48]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Yamaha blue ring accent on podium edge */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[1.65, 0.015, 8, 64]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>
      {/* Subtle blue glow underneath bike */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={isMobile ? 0 : 2}
        color="#005BAC"
        distance={3.5}
        decay={2}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────
   Floating bike name tag using HTML overlay
───────────────────────────────────────────── */
function BikeLabel({ bike }: { bike: Bike }) {
  return (
    <Html
      position={[bike.position[0], 2.4, bike.position[2]]}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="bike-label">
        {bike.name}
      </div>
    </Html>
  );
}

/* ─────────────────────────────────────────────
   Polished floor — single plane, high reflection
───────────────────────────────────────────── */
function ShowroomFloor({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {/* Main floor — large enough to fill view */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#f3f3f3"
          roughness={isMobile ? 0.5 : 0.08}
          metalness={isMobile ? 0 : 0.12}
        />
      </mesh>

      {/* Yamaha blue centre stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[isMobile ? 16 : 30, 0.05]} />
        <meshBasicMaterial color="#005BAC" />
      </mesh>
      {/* Flanking thin stripes */}
      {!isMobile && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 3.5]}>
            <planeGeometry args={[30, 0.025]} />
            <meshBasicMaterial color="#005BAC" opacity={0.5} transparent />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -3.5]}>
            <planeGeometry args={[30, 0.025]} />
            <meshBasicMaterial color="#005BAC" opacity={0.5} transparent />
          </mesh>
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Simple placeholder when no GLB is available
───────────────────────────────────────────── */
function PlaceholderBike({ bike, onSelect }: { bike: Bike; onSelect: (id: string) => void }) {
  const color = bike.colors[0]?.hex ?? '#005BAC';
  return (
    <group
      position={bike.position}
      rotation={bike.rotation ?? [0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(bike.id); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2.0, 0.65, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0.85, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.15, 20]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[-0.85, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.15, 20]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Shadow bake — ONE-time texture, zero per-frame cost.
   Skipped on mobile (CSS box-shadow on HTML layer instead)
───────────────────────────────────────────── */
function BakedShadows({ bikes, isMobile }: { bikes: Bike[]; isMobile: boolean }) {
  if (isMobile) return null;

  // Render a soft disc shadow under each bike manually
  return (
    <>
      {bikes.map((bike) => (
        <mesh
          key={bike.id + '-shadow'}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[bike.position[0], 0.002, bike.position[2]]}
        >
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.07} />
        </mesh>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Lighting — minimal set for bright showroom
───────────────────────────────────────────── */
function ShowroomLighting({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {/* Bright ambient — base brightness */}
      <ambientLight intensity={isMobile ? 5 : 3.5} color="#ffffff" />

      {/* Single overhead directional — acts as the "track lights" */}
      <directionalLight
        position={[2, 14, 8]}
        intensity={isMobile ? 2.5 : 3.5}
        color="#fff9f2"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? undefined : [1024, 1024]}
        shadow-camera-near={2}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={12}
        shadow-camera-bottom={-8}
      />

      {/* Soft front fill — removes harsh shadows from front */}
      <directionalLight position={[0, 4, 18]} intensity={1.2} color="#ffffff" />

      {/* Left/right rim lights — skipped on mobile */}
      {!isMobile && (
        <>
          <directionalLight position={[-12, 6, 0]} intensity={0.6} color="#fff8f0" />
          <directionalLight position={[12, 6, 0]} intensity={0.6} color="#fff8f0" />
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
interface ShowroomCanvasProps {
  bikes: Bike[];
  onSelectBike: (id: string) => void;
}

export default function ShowroomCanvas({ bikes, onSelectBike }: ShowroomCanvasProps) {
  // Detect mobile/low-power device — used to gate expensive effects
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent)
  );

  return (
    <div
      className="w-full h-screen showroom-bg"
      /* Touch-action: manipulation prevents 300ms click delay on mobile */
      style={{ touchAction: 'manipulation' }}
    >
      <Canvas
        shadows={isMobile ? false : 'soft'}
        dpr={isMobile ? 1 : [1, 1.5]}
        /* 
         * Switch to 'always' on mobile temporarily to ensure models pop in 
         * without needing a touch event.
         */
        frameloop={isMobile ? 'always' : 'demand'}
        onCreated={({ gl }) => {
          gl.setClearColor('#f0f0f0', 1);
        }}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: false,
          precision: isMobile ? 'mediump' : 'highp',
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={isMobile ? [0, 2.5, 10] : [0, 3.5, 16]}
          fov={isMobile ? 62 : 55}
        />
        <OrbitControls
          enablePan={true}
          panSpeed={isMobile ? 1.5 : 1.0}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.02}   /* slightly more headroom, stops before floor clipping */
          minDistance={isMobile ? 4 : 5}
          maxDistance={isMobile ? 22 : 30}
          makeDefault
          enableDamping
          dampingFactor={0.07}
          /*
           * rotateSpeed slightly higher for 'free' feel
           */
          rotateSpeed={isMobile ? 0.7 : 0.9}
          zoomSpeed={0.8}
          /* Prevent camera from going too far from showroom center */
          maxTargetRadius={20}
        />

        <ShowroomLighting isMobile={isMobile} />
        
        {/* ── SHOWROOM ROOM & ENVIRONMENT (Loads fast) ── */}
        <Suspense fallback={null}>
          <Environment preset="apartment" background={false} resolution={isMobile ? 32 : 64} />
          <ShowroomFloor isMobile={isMobile} />
          <ShowroomRoom isMobile={isMobile} />
        </Suspense>

        {/* ── BIKE MODELS (Loads heavy assets) ── */}
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-2">
              <div className="spinner" style={{ width: 24, height: 24 }} />
              <p style={{ 
                fontSize: 9, 
                fontWeight: 700, 
                letterSpacing: '0.15em', 
                color: '#005BAC', 
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.8)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                Downloading Models...
              </p>
            </div>
          </Html>
        }>
          <Bvh>
            {bikes.map((bike) => (
              <group key={bike.id}>
                <DisplayPodium position={bike.position} isMobile={isMobile} />

                {bike.modelUrl ? (
                  <BikeModel
                    url={bike.modelUrl}
                    position={bike.position}
                    scale={bike.scale ?? 1}
                    rotation={bike.rotation ?? [0, 0, 0]}
                    onSelect={() => onSelectBike(bike.id)}
                  />
                ) : (
                  <PlaceholderBike bike={bike} onSelect={onSelectBike} />
                )}

                <BikeLabel bike={bike} />
              </group>
            ))}

            <BakedShadows bikes={bikes} isMobile={isMobile} />
          </Bvh>
        </Suspense>

      </Canvas>
    </div>
  );
}

// Preload banner texture so it doesn't pop in
useTexture.preload('/images/yamaha_eid_banner.png');
