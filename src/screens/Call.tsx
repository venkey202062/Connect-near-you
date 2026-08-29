import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Avatar } from '../components/ui';
import { Message } from '../data/mockData';

type CallPhase = 'calling' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'declined' | 'no_answer' | 'busy' | 'network_error';

// ─── AudioCallScreen ──────────────────────────────────────────────────────────
export function AudioCallScreen() {
  const { state, goBack, navigate, dispatch, params } = useApp();
  const userId = params.userId as string;
  const user = state.users.find(u => u.id === userId);

  const [phase, setPhase] = useState<CallPhase>('calling');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('connecting'), 2000);
    const t2 = setTimeout(() => setPhase('connected'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== 'connected') return;
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  function endCall() {
    const durStr = phase === 'connected'
      ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`
      : undefined;

    const conv = state.conversations.find(c => c.userId === userId);
    if (conv) {
      const msg: Message = {
        id: `m_${Date.now()}`,
        senderId: 'me',
        type: 'call_audio',
        callStatus: phase === 'connected' ? 'ended' : 'declined',
        callDuration: durStr,
        timestamp: new Date(),
        status: 'read',
      };
      dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: msg });
    }
    setPhase('ended');
    setTimeout(() => goBack(), 1200);
  }

  function declineCall() {
    setPhase('declined');
    setTimeout(() => goBack(), 1200);
  }

  const durationStr = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;

  const phaseLabel: Record<CallPhase, string> = {
    calling: 'Calling…',
    connecting: 'Connecting…',
    connected: durationStr,
    reconnecting: 'Reconnecting…',
    ended: 'Call ended',
    declined: 'Call declined',
    no_answer: 'No answer',
    busy: 'Line busy',
    network_error: 'Network error',
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full items-center justify-between bg-gradient-to-b from-[#0F0020] to-[#0A0A16] py-16">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-5 pt-6">
        <div className="relative">
          {phase === 'calling' && (
            <>
              <div className="absolute inset-0 rounded-full bg-[#FF3D6B]/20 animate-ping scale-150" />
              <div className="absolute inset-0 rounded-full bg-[#FF3D6B]/10 animate-ping scale-125" style={{ animationDelay: '0.3s' }} />
            </>
          )}
          <Avatar user={user} size="2xl" />
        </div>
        <div className="text-center">
          <h2 data-heading className="text-3xl font-extrabold text-white">{user.name}</h2>
          <p className={`text-lg mt-2 font-medium ${
            phase === 'connected' ? 'text-emerald-400' :
            phase === 'declined' || phase === 'ended' ? 'text-[#7070A0]' :
            'text-[#B8B8D8]'
          }`}>{phaseLabel[phase]}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full px-8">
        {phase === 'connected' ? (
          <div className="flex flex-col gap-8">
            <div className="flex justify-center gap-8">
              <CallControlBtn icon={muted ? '🔇' : '🎤'} label={muted ? 'Unmute' : 'Mute'} active={muted} onClick={() => setMuted(v => !v)} />
              <CallControlBtn icon={speaker ? '🔊' : '🔈'} label="Speaker" active={speaker} onClick={() => setSpeaker(v => !v)} />
              <CallControlBtn icon="💬" label="Message" onClick={() => { endCall(); }} />
            </div>
            <button onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-2xl mx-auto active:scale-95 shadow-lg shadow-red-500/30">
              📵
            </button>
          </div>
        ) : phase === 'calling' || phase === 'connecting' || phase === 'reconnecting' ? (
          <div className="flex justify-center gap-12">
            <button onClick={declineCall}
              className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-2xl active:scale-95">📵</div>
              <span className="text-[#B8B8D8] text-sm">Decline</span>
            </button>
          </div>
        ) : (
          <button onClick={goBack}
            className="w-full py-4 rounded-2xl bg-[#141424] text-[#B8B8D8] font-semibold">
            Close
          </button>
        )}
      </div>
    </div>
  );
}

// ─── VideoCallScreen ──────────────────────────────────────────────────────────
export function VideoCallScreen() {
  const { state, goBack, dispatch, params } = useApp();
  const userId = params.userId as string;
  const user = state.users.find(u => u.id === userId);

  const [phase, setPhase] = useState<CallPhase>('calling');
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('connecting'), 1800);
    const t2 = setTimeout(() => setPhase('connected'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== 'connected') return;
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  function endCall() {
    const durStr = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
    const conv = state.conversations.find(c => c.userId === userId);
    if (conv) {
      const msg: Message = {
        id: `m_${Date.now()}`,
        senderId: 'me',
        type: 'call_video',
        callStatus: phase === 'connected' ? 'ended' : 'declined',
        callDuration: phase === 'connected' ? durStr : undefined,
        timestamp: new Date(),
        status: 'read',
      };
      dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: msg });
    }
    setPhase('ended');
    setTimeout(() => goBack(), 1000);
  }

  const durationStr = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;

  if (!user) return null;

  return (
    <div className="relative flex flex-col h-full bg-black overflow-hidden">
      {/* Remote video / bg */}
      {phase === 'connected' ? (
        <img src={user.photos[0] || ''} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 scale-110 blur-sm" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0020] to-[#0A0A16]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Header status */}
      <div className="relative flex items-center justify-between px-5 pt-3 pb-4">
        <div>
          <h2 data-heading className="text-white font-bold text-xl">{user.name}</h2>
          <p className={`text-sm font-medium ${phase === 'connected' ? 'text-emerald-400' : 'text-white/60'}`}>
            {phase === 'calling' ? 'Video calling…' : phase === 'connecting' ? 'Connecting…' : phase === 'connected' ? durationStr : 'Call ended'}
          </p>
        </div>
      </div>

      {/* Self-view PiP */}
      {phase === 'connected' && (
        <div className="absolute top-20 right-4 w-24 h-36 rounded-2xl overflow-hidden border-2 border-white/20 bg-[#1E1E32]">
          {cameraOn ? (
            <div className="w-full h-full bg-gradient-to-b from-[#2D2D4A] to-[#1A1A2C] flex items-center justify-center">
              <span className="text-4xl">🤳</span>
            </div>
          ) : (
            <div className="w-full h-full bg-[#1E1E32] flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
          )}
        </div>
      )}

      {/* Center area for calling state */}
      {phase !== 'connected' && (
        <div className="relative flex-1 flex flex-col items-center justify-center gap-5">
          <Avatar user={user} size="2xl" />
          <div className="text-center">
            <h2 data-heading className="text-3xl font-extrabold text-white">{user.name}</h2>
            <p className="text-[#B8B8D8] text-lg mt-2">{phase === 'calling' ? 'Video calling…' : 'Connecting…'}</p>
          </div>
        </div>
      )}

      {phase === 'connected' && <div className="flex-1" />}

      {/* Controls */}
      <div className="relative px-8 pb-14">
        {phase === 'connected' && (
          <div className="flex justify-center gap-6 mb-8">
            <CallControlBtn icon={muted ? '🔇' : '🎤'} label={muted ? 'Unmute' : 'Mute'} active={muted} onClick={() => setMuted(v => !v)} dark />
            <CallControlBtn icon={cameraOn ? '📹' : '📷'} label={cameraOn ? 'Camera off' : 'Camera on'} active={!cameraOn} onClick={() => setCameraOn(v => !v)} dark />
            <CallControlBtn icon="🔄" label="Flip" onClick={() => setFrontCamera(v => !v)} dark />
          </div>
        )}
        <button onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-2xl mx-auto active:scale-95 shadow-xl shadow-red-500/30">
          📵
        </button>
      </div>
    </div>
  );
}

// ─── IncomingCallScreen ───────────────────────────────────────────────────────
export function IncomingCallScreen() {
  const { state, goBack, navigate, params } = useApp();
  const userId = params.userId as string;
  const callType = (params.callType as string) || 'audio';
  const user = state.users.find(u => u.id === userId);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full items-center justify-between bg-gradient-to-b from-[#0F0020] to-[#0A0A16] py-20">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping scale-150" />
          <Avatar user={user} size="2xl" />
        </div>
        <div className="text-center">
          <h2 data-heading className="text-3xl font-extrabold text-white">{user.name}</h2>
          <p className="text-[#B8B8D8] text-base mt-2">
            {callType === 'video' ? '📹 Incoming video call' : '📞 Incoming call'}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-16">
        <div className="flex flex-col items-center gap-3">
          <button onClick={goBack}
            className="w-18 h-18 w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-3xl active:scale-95 shadow-lg shadow-red-500/30">
            📵
          </button>
          <span className="text-[#B8B8D8] text-sm">Decline</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button onClick={() => navigate(callType === 'video' ? 'video_call' : 'audio_call', { userId })}
            className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl active:scale-95 shadow-lg shadow-emerald-500/30">
            {callType === 'video' ? '📹' : '📞'}
          </button>
          <span className="text-[#B8B8D8] text-sm">Accept</span>
        </div>
      </div>
    </div>
  );
}

// ─── CallControlBtn ───────────────────────────────────────────────────────────
function CallControlBtn({
  icon, label, active, onClick, dark,
}: { icon: string; label: string; active?: boolean; onClick: () => void; dark?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors ${
        active
          ? 'bg-white/90 text-black'
          : dark ? 'bg-white/15 text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'
      }`}>
        {icon}
      </div>
      <span className="text-[#B8B8D8] text-xs">{label}</span>
    </button>
  );
}
