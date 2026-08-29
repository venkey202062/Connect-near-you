import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Button, Avatar, StatusBadge } from '../components/ui';

const MAP_PINS = [
  { userId: 'u1', x: 52, y: 38 },
  { userId: 'u2', x: 34, y: 55 },
  { userId: 'u3', x: 68, y: 42 },
  { userId: 'u4', x: 45, y: 62 },
  { userId: 'u5', x: 78, y: 58 },
  { userId: 'u6', x: 28, y: 35 },
  { userId: 'u7', x: 60, y: 70 },
  { userId: 'u8', x: 82, y: 28 },
];

export function MapScreen() {
  const { state, navigate, goBack, dispatch } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLocation, setMapLocation] = useState(state.location);

  const selectedUser = selectedUserId ? state.users.find(u => u.id === selectedUserId) : null;

  const visiblePins = MAP_PINS.filter(p => {
    const user = state.users.find(u => u.id === p.userId);
    return user && !state.blockedIds.includes(p.userId);
  });

  function confirmLocation() {
    dispatch({ type: 'SET_LOCATION', location: mapLocation || 'Central London' });
    navigate('discover');
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16] overflow-hidden">
      {/* Map area */}
      <div className="relative flex-1" onClick={() => setSelectedUserId(null)}>
        {/* Back button */}
        <button onClick={goBack}
          className="absolute top-12 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#141424]/90 text-[#F0F0FA] backdrop-blur-sm">
          ←
        </button>

        {/* Map title */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-[#141424]/90 backdrop-blur-sm rounded-2xl px-4 py-2">
          <p className="text-[#F0F0FA] text-sm font-semibold">Central London</p>
        </div>

        {/* CSS Map */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base map texture */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, #1A1A3A 0%, #0E0E22 60%, #080814 100%)',
          }} />

          {/* Grid lines (streets) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal streets */}
            {[15, 25, 35, 45, 55, 65, 75, 85].map(y => (
              <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#4A4A7A" strokeWidth="1.5" />
            ))}
            {/* Vertical streets */}
            {[12, 22, 35, 48, 60, 72, 85].map(x => (
              <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#4A4A7A" strokeWidth="1.5" />
            ))}
            {/* Diagonal roads */}
            <line x1="0" y1="30%" x2="40%" y2="60%" stroke="#5A5A8A" strokeWidth="2" />
            <line x1="60%" y1="20%" x2="100%" y2="70%" stroke="#5A5A8A" strokeWidth="2" />
            <line x1="20%" y1="80%" x2="80%" y2="30%" stroke="#5A5A8A" strokeWidth="2" />
          </svg>

          {/* Parks / blocks */}
          <div className="absolute rounded-2xl bg-emerald-900/20 border border-emerald-700/15" style={{ left: '15%', top: '20%', width: '18%', height: '15%' }} />
          <div className="absolute rounded-xl bg-emerald-900/15 border border-emerald-700/10" style={{ left: '55%', top: '55%', width: '12%', height: '10%' }} />
          <div className="absolute rounded-xl bg-blue-900/15 border border-blue-700/10" style={{ left: '35%', top: '70%', width: '20%', height: '8%' }} />

          {/* Search radius circle */}
          <div className="absolute border-2 border-[#FF3D6B]/30 rounded-full"
            style={{
              left: '30%', top: '25%',
              width: '40%', height: '50%',
              background: 'radial-gradient(ellipse, rgba(255,61,107,0.05) 0%, transparent 70%)',
            }} />

          {/* Center pin (me) */}
          <div className="absolute z-10 flex flex-col items-center" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}>
            <div className="w-8 h-8 rounded-full bg-[#FF3D6B] flex items-center justify-center text-white text-sm shadow-lg shadow-[#FF3D6B]/40 ring-2 ring-white/30">
              ✦
            </div>
            <div className="w-0.5 h-3 bg-[#FF3D6B]" />
          </div>

          {/* User pins */}
          {visiblePins.map(pin => {
            const user = state.users.find(u => u.id === pin.userId);
            if (!user) return null;
            const isSelected = selectedUserId === pin.userId;
            return (
              <button
                key={pin.userId}
                onClick={e => { e.stopPropagation(); setSelectedUserId(pin.userId); }}
                className="absolute z-10 flex flex-col items-center transition-transform active:scale-110"
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: `translate(-50%, -100%) ${isSelected ? 'scale(1.15)' : ''}` }}
              >
                <div className={`rounded-full overflow-hidden border-2 shadow-lg transition-all ${
                  user.status === 'online' ? 'border-emerald-400' : isSelected ? 'border-[#FF3D6B]' : 'border-white/50'
                }`} style={{ width: 44, height: 44 }}>
                  {user.photos[0] ? (
                    <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2D2D4A] flex items-center justify-center">
                      <span className="text-lg font-bold text-[#FF3D6B]/50">{user.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="w-0.5 h-2 bg-white/50" />
              </button>
            );
          })}
        </div>

        {/* Mini profile popup */}
        {selectedUser && (
          <div className="absolute bottom-8 left-4 right-4 z-30 bg-[#141424] rounded-2xl p-4 shadow-2xl border border-white/10 fade-in">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1E1E32] flex-shrink-0">
                {selectedUser.photos[0] ? (
                  <img src={selectedUser.photos[0]} alt={selectedUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#FF3D6B]/30">{selectedUser.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#F0F0FA]">{selectedUser.name}, {selectedUser.age}</p>
                <p className="text-[#7070A0] text-sm">📍 {selectedUser.distance.toFixed(1)} km</p>
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

      {/* Bottom sheet for location selection */}
      {!selectedUser && (
        <div className="bg-[#141424] border-t border-white/5 px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#FF3D6B]">📍</span>
            <p className="text-[#F0F0FA] font-semibold">{mapLocation}</p>
          </div>
          <div className="relative mb-4">
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (e.target.value) setMapLocation(e.target.value); }}
              placeholder="Search a location…"
              className="w-full bg-[#1E1E32] border border-white/10 rounded-2xl pl-4 pr-4 py-3 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50"
            />
          </div>
          <Button variant="primary" fullWidth onClick={confirmLocation}>
            Search Here
          </Button>
        </div>
      )}
    </div>
  );
}
