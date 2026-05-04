'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface ARViewProps {
  modelUrl: string;
  onClose: () => void;
}

export default function ARView({ modelUrl, onClose }: ARViewProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import model-viewer side-effect
    import('@google/model-viewer').catch(console.error);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <p className="text-xs font-bold tracking-widest text-[#005BAC] uppercase">AR Mode</p>
          <h2 className="text-xl font-bold">Place in your space</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* AR Viewport */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#005BAC]" />
            <p className="text-sm font-medium tracking-widest uppercase">Loading 3D Model...</p>
          </div>
        )}
        
        {/* @ts-ignore */}
        <model-viewer
          src={modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          poster="poster.webp"
          shadow-intensity="1"
          auto-rotate
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          onLoad={() => setLoading(false)}
        >
          <button slot="ar-button" className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#005BAC] text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-6 h-6 border-2 border-white rounded-md relative">
              <div className="absolute inset-1 border border-white/50" />
            </div>
            START AR EXPERIENCE
          </button>
        {/* @ts-ignore */}
        </model-viewer>
      </div>

      {/* Instructions Overlay */}
      {!loading && (
        <div className="absolute bottom-32 left-0 w-full p-8 text-center pointer-events-none">
          <p className="text-white/60 text-xs font-medium bg-black/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">
            Move your phone to find the floor
          </p>
        </div>
      )}
    </div>
  );
}
