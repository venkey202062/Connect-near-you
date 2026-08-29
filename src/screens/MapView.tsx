import { useState, useRef, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { Button, StatusBadge } from '../components/ui';

// World coordinates for each user pin (in px, relative to a 800×800 world)
const MAP_PINS = [
  { userId: 'u1', wx: 420, wy: 300 },
  { userId: 'u2', wx: 270, wy: 440 },
  { userId: 'u3', wx: 540, wy: 340 },
  { userId: 'u4', wx: 360, wy: 500 },
  { userId: 'u5', wx: 620, wy: 465 },
  { userId: 'u6', wx: 225, wy: 280 },
  { userId: 'u7', wx: 480, wy: 560 },
  { userId: 'u8', wx: 660, wy: 225 },
  { userId: 'u1', wx: 160, wy: 550 },  // Emma shows twice (different area)
  { userId: 'u3', wx: 700, wy: 400 },
];

// Neighbourhood names keyed by rough zone
const PLACE_NAMES = [
  { x: 0,    y: 0,    name: 'Shoreditch' },
  { x: -100, y: 0,    name: 'Old Street' },
  { x: 100,  y: 0,    name: 'Bethnal Green' },
  { x: 0,    y: -100, name: 'Islington' },
  { x: 0,    y: 100,  name: 'Bermondsey' },
  { x: -100, y: -100, name: 'Angel' },
  { x: 100,  y: -100, name: 'Dalston' },
  { x: -100, y: 100,  name: 'Borough' },
  { x: 100,  y: 100,  name: 'Hackney Wick' },
  { x: -200, y: 0,    name: 'Central London' },
  { x: 200,  y: 0,    name: 'Mile End' },
  { x: 0,    y: -200, name: 'Highbury' },
  { x: 0,    y: 200,  name: 'New Cross' },
  { x: -200, y: -200, name: 'Camden' },
  { x: 200,  y: -200, name: 'Stoke Newington' },
  { x: -200, y: 200,  name: 'Elephant & Castle' },
  { x: 200,  y: 200,  name: 'Forest Gate' },
];

function locationFromOffset(ox: number, oy: number): string {
  let best = PLACE_NAMES[0];
  let bestDist = Infinity;
  for (const p of PLACE_NAMES) {
    const d = Math.hypot(p.x - ox, p.y - oy);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  return best.name;
}

// Streets for the world map (absolute world coords)
const STREETS_H = [80, 160, 240, 320, 400, 480, 560, 640, 720];
const STREETS_V = [80, 160, 240, 320, 400, 480, 560, 640, 720];
const DIAGONALS = [
  { x1: 0, y1: 200, x2: 300, y2: 600 },
  { x1: 500, y1: 100, x2: 800, y2: 550 },
  { x1: 150, y1: 700, x2: 650, y2: 200 },
  { x1: 200, y1: 0,   x2: 600, y2: 300 },
];
const PARKS = [
  { x: 100, y: 150, w: 110, h: 80 },
  { x: 450, y: 450, w: 80,  h: 60 },
  { x: 550, y: 600, w: 100, h: 70 },
  { x: 250, y: 580, w: 90,  h: 55 },
];
const WATER = [
  { x: 0, y: 370, w: 800, h: 18 },   // Thames-like horizontal
];

export function MapScreen() {
  const { state, navigate, goBack, dispatch } = useApp();
  const [selectedPin, setSelectedPin] = useState<{ userId: string; wx: number; wy: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const VIEWPORT_W = 370;
  const VIEWPORT_H = 480;
  const WORLD_SIZE = 800;
  // Center of world in viewport
  const cx = VIEWPORT_W / 2;
  const cy = VIEWPORT_H / 2;
  // World origin is offset so world (400,400) = viewport center at offset(0,0)
  const originX = cx - WORLD_SIZE / 2 + offset.x;
  const originY = cy - WORLD_SIZE / 2 + offset.y;

  const locationName = locationFromOffset(offset.x, offset.y);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
    setIsDragging(false);
    setSelectedPin(null);
  }, [offset]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    if (Math.hypot(dx, dy) > 4) setIsDragging(true);
    const maxOff = 300;
    setOffset({
      x: Math.max(-maxOff, Math.min(maxOff, dragStart.current.ox + dx)),
      y: Math.max(-maxOff, Math.min(maxOff, dragStart.current.oy + dy)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  function confirmLocation() {
    dispatch({ type: 'SET_LOCATION', location: locationName });
    navigate('discover');
  }

  const selectedUser = selectedPin ? state.users.find(u => u.id === selectedPin.userId) : null;

  // Deduplicate visible pins
  const seenUsers = new Set<string>();
  const visiblePins = MAP_PINS.filter(p => {
    if (seenUsers.has(p.userId + p.wx)) return false;
    seenUsers.add(p.userId + p.wx);
    return !state.blockedIds.includes(p.userId);
  });

  return (
    <div className="flex flex-col h-full bg-[#0A0A16] overflow-hidden">
      {/* Map viewport */}
      <div
        ref={mapRef}
        className="relative flex-1 overflow-hidden cursor-grab select-none"
        style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* ── World canvas ─────────────────────────────── */}
        <div
          className="absolute"
          style={{
            left: originX,
            top: originY,
            width: WORLD_SIZE,
            height: WORLD_SIZE,
          }}
        >
          {/* Base */}
          <div className="absolute inset-0" style={{ background: '#10101e' }} />

          {/* Streets SVG */}
          <svg className="absolute inset-0" width={WORLD_SIZE} height={WORLD_SIZE}>
            {/* Water */}
            {WATER.map((w, i) => (
              <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#1a2a4a" opacity={0.8} />
            ))}
            {/* Blocks (city grid fill) */}
            {STREETS_H.slice(0, -1).map((y, yi) =>
              STREETS_V.slice(0, -1).map((x, xi) => (
                <rect key={`b${yi}-${xi}`} x={x + 2} y={y + 2}
                  width={STREETS_V[xi + 1] - x - 4} height={STREETS_H[yi + 1] - y - 4}
                  fill="#14142a" opacity={0.7} rx={2} />
              ))
            )}
            {/* Parks */}
            {PARKS.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={8}
                fill="#1a2e1a" stroke="#2a4a2a" strokeWidth={1} opacity={0.9} />
            ))}
            {/* H streets */}
            {STREETS_H.map(y => (
              <line key={`h${y}`} x1={0} y1={y} x2={WORLD_SIZE} y2={y}
                stroke="#2a2a4a" strokeWidth={1.5} opacity={0.8} />
            ))}
            {/* V streets */}
            {STREETS_V.map(x => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={WORLD_SIZE}
                stroke="#2a2a4a" strokeWidth={1.5} opacity={0.8} />
            ))}
            {/* Diagonals */}
            {DIAGONALS.map((d, i) => (
              <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
                stroke="#3a3a5a" strokeWidth={2.5} opacity={0.6} />
            ))}
            {/* Major roads (thicker) */}
            <line x1={0} y1={400} x2={800} y2={400} stroke="#3a3a6a" strokeWidth={3} opacity={0.9} />
            <line x1={400} y1={0} x2={400} y2={800} stroke="#3a3a6a" strokeWidth={3} opacity={0.9} />
          </svg>

          {/* User pins */}
          {visiblePins.map((pin, idx) => {
            const user = state.users.find(u => u.id === pin.userId);
            if (!user) return null;
            const isSelected = selectedPin?.wx === pin.wx && selectedPin?.userId === pin.userId;
            return (
              <button
                key={`${pin.userId}-${idx}`}
                onPointerDown={e => e.stopPropagation()}
                onClick={e => {
                  e.stopPropagation();
                  if (!isDragging) setSelectedPin(isSelected ? null : pin);
                }}
                className="absolute flex flex-col items-center z-10"
                style={{
                  left: pin.wx,
                  top: pin.wy,
                  transform: `translate(-50%, -100%) scale(${isSelected ? 1.2 : 1})`,
                  transition: 'transform 0.15s',
                }}
              >
                <div className={`rounded-full overflow-hidden shadow-xl border-2 ${
                  user.status === 'online' ? 'border-emerald-400 shadow-emerald-500/30' :
                  isSelected ? 'border-[#FF3D6B]' : 'border-white/40'
                }`} style={{ width: 46, height: 46 }}>
                  {user.photos[0] ? (
                    <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" draggable={false} />
                  ) : (
                    <div className="w-full h-full bg-[#2D2D4A] flex items-center justify-center">
                      <span className="font-bold text-[#FF3D6B]/60 text-lg">{user.name[0]}</span>
                    </div>
                  )}
                </div>
                {/* Pin stem */}
                <div className={`w-0.5 h-2.5 ${isSelected ? 'bg-[#FF3D6B]' : 'bg-white/40'}`} />
                {/* Name label */}
                {isSelected && (
                  <div className="absolute -bottom-7 bg-[#FF3D6B] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                    {user.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* ── /World canvas ──────────────────────────── */}

        {/* Crosshair center pin (fixed to viewport) */}
        <div className="absolute pointer-events-none z-20 flex flex-col items-center"
          style={{ left: cx, top: cy, transform: 'translate(-50%, -100%)' }}>
          <div className="w-9 h-9 rounded-full bg-[#FF3D6B] flex items-center justify-center text-white shadow-xl shadow-[#FF3D6B]/50 ring-4 ring-[#FF3D6B]/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
            </svg>
          </div>
          <div className="w-0.5 h-4 bg-[#FF3D6B]" />
        </div>

        {/* Radius ring (fixed to viewport center) */}
        <div className="absolute pointer-events-none z-10 rounded-full border-2 border-[#FF3D6B]/25"
          style={{
            left: cx - 120, top: cy - 140,
            width: 240, height: 280,
            background: 'radial-gradient(ellipse, rgba(255,61,107,0.04) 0%, transparent 70%)',
          }} />

        {/* Back button */}
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={goBack}
          className="absolute top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-[#0A0A16]/80 text-[#F0F0FA] backdrop-blur-sm border border-white/10 shadow-lg"
        >
          ←
        </button>

        {/* Location label (top center) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-[#0A0A16]/85 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2 shadow-lg">
            <span className="text-[#FF3D6B] text-sm">📍</span>
            <span className="text-[#F0F0FA] text-sm font-semibold">{locationName}</span>
          </div>
        </div>

        {/* Drag hint */}
        {!isDragging && offset.x === 0 && offset.y === 0 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none fade-in">
            <div className="bg-black/60 backdrop-blur-sm text-white/60 text-xs px-3 py-1.5 rounded-full">
              Drag to explore
            </div>
          </div>
        )}

        {/* Selected user card */}
        {selectedUser && !isDragging && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-[#141424]/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10 fade-in">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1E1E32] flex-shrink-0 flex-shrink-0">
                {selectedUser.photos[0] ? (
                  <img src={selectedUser.photos[0]} alt={selectedUser.name} className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#FF3D6B]/30">{selectedUser.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#F0F0FA]">{selectedUser.name}, {selectedUser.age}</p>
                <p className="text-[#7070A0] text-sm">📍 {selectedUser.distance.toFixed(1)} km away</p>
                <StatusBadge status={selectedUser.status} />
              </div>
              <Button variant="primary" size="sm"
                onClick={() => navigate('profile_view', { userId: selectedUser.id })}>
                View
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div className="bg-[#141424] border-t border-white/5 px-5 pt-4 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Search from this location</p>
            <p className="text-[#F0F0FA] font-bold mt-0.5">{locationName}</p>
          </div>
          {(offset.x !== 0 || offset.y !== 0) && (
            <button onClick={() => setOffset({ x: 0, y: 0 })}
              className="text-[#7070A0] text-xs underline">
              Reset
            </button>
          )}
        </div>
        <Button variant="primary" fullWidth onClick={confirmLocation}>
          Search Here
        </Button>
      </div>
    </div>
  );
}
