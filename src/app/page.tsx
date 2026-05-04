'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SplashScreen from '@/components/UI/SplashScreen';
import BikeDetails from '@/components/UI/BikeDetails';
import ARView from '@/components/AR/ARView';
import { CATEGORIES, getBikesByCategory, type Bike, type BikeCategory } from '@/lib/bikeData';
import { useAnalytics } from '@/hooks/useAnalytics';

// Canvas must not SSR — it needs the DOM + WebGL context
const ShowroomCanvas = dynamic(() => import('@/components/Showroom/ShowroomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen showroom-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner" />
        <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>
          Loading Showroom
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [activeCategory, setActiveCategory] = useState<BikeCategory>('FZ SERIES');
  const [showAR, setShowAR] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    track('showroom_load');
  }, [track]);

  const filteredBikes = getBikesByCategory(activeCategory);

  const handleCategoryClick = useCallback(
    (cat: BikeCategory) => {
      setActiveCategory(cat);
      setSelectedBike(null);
      track('category_click', { category: cat });
    },
    [track]
  );

  const handleSelectBike = useCallback(
    (id: string) => {
      const bike = filteredBikes.find((b) => b.id === id) ?? null;
      setSelectedBike(bike);
      if (bike) track('model_click', { model: bike.name, category: bike.category });
    },
    [filteredBikes, track]
  );

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

      <main className="relative w-full h-screen overflow-hidden">

        {/* ── Yamaha brand stripes (CSS only, zero GPU cost) ── */}
        <div className="yamaha-stripe-top" />
        <div className="yamaha-stripe-bottom" />

        {/* ── 3D Showroom ── */}
        <div className="absolute inset-0">
          <ShowroomCanvas bikes={filteredBikes} onSelectBike={handleSelectBike} />
        </div>

        {/* ── UI Overlay ── */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">

          {/* ── Top Header ── */}
          <header
            className="pointer-events-auto flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4"
            style={{
              background: 'linear-gradient(to bottom, rgba(248,248,248,0.97) 0%, rgba(248,248,248,0) 100%)',
            }}
          >
            {/* Logo + title */}
            <div className="flex items-center gap-3">
              {/* Yamaha "Y" tuning fork icon placeholder */}
              <div
                style={{
                  width: 36, height: 36,
                  background: '#005BAC',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20h3l5-10 5 10h3L12 2z" fill="white" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.03em', color: '#111', lineHeight: 1, margin: 0 }}>
                  YAMAHA <span style={{ color: '#005BAC' }}>EID OFFER</span>
                </h1>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', color: '#999', textTransform: 'uppercase', margin: 0 }}>
                  Virtual Showroom
                </p>
              </div>
            </div>

            {/* Badge: 2025 Eid */}
            <div
              style={{
                background: '#005BAC',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                padding: '6px 14px',
                borderRadius: 999,
              }}
            >
              EID 2025
            </div>
          </header>

          {/* ── Centre "tap" hint ── */}
          {!selectedBike && splashDone && (
            <div
              className="flex flex-col items-center gap-2 pointer-events-none"
              style={{ marginBottom: 100 }}
            >
              {/* Animated tap icon */}
              <div style={{ animation: 'fadeIn 0.6s ease' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="rgba(0,91,172,0.2)" strokeWidth="1.5" />
                  <path
                    d="M16 10v6l4 4"
                    stroke="#005BAC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <p style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(0,0,0,0.35)',
                textTransform: 'uppercase',
              }}>
                Tap a bike to explore
              </p>
            </div>
          )}

          {/* ── Bottom: Category navigation ── */}
          <nav
            className="pointer-events-auto"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            }}
          >
            {/* Yamaha horizontal separator */}
            <div style={{ height: 1, background: 'rgba(0,91,172,0.12)', marginBottom: 0 }} />

            {/* White frosted background */}
            <div
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '14px 16px 16px',
              }}
            >
              {/* Category label */}
              <p style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#aaa',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 10,
              }}>
                Select Series
              </p>

              {/* Pills row */}
              <div
                className="scrollbar-hide"
                style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  justifyContent: 'center',
                  paddingBottom: 2,
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`cat-pill${activeCategory === cat ? ' active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Model count */}
              <p style={{
                textAlign: 'center',
                fontSize: 10,
                color: '#bbb',
                marginTop: 10,
                fontWeight: 500,
                letterSpacing: '0.1em',
              }}>
                {filteredBikes.length} model{filteredBikes.length !== 1 ? 's' : ''} on display
              </p>
            </div>
          </nav>
        </div>

        {/* ── Admin link (tiny, unobtrusive) ── */}
        <a
          href="/admin"
          title="Admin"
          style={{
            position: 'absolute',
            top: 60,
            right: 16,
            zIndex: 20,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </a>

        {/* ── Bike Details Side Panel ── */}
        <BikeDetails
          selectedBike={selectedBike}
          onClose={() => setSelectedBike(null)}
          onEnterAR={() => setShowAR(true)}
        />

        {/* ── AR View ── */}
        {showAR && selectedBike && (
          <ARView
            modelUrl={selectedBike.modelUrl ?? '/models/yamaha_yzf-r3_2017.glb'}
            onClose={() => setShowAR(false)}
          />
        )}
      </main>
    </>
  );
}
