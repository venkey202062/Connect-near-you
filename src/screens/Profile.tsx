import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Button, Avatar, StatusBadge, InterestChip, Modal, BottomSheet, BackHeader } from '../components/ui';

// ─── ProfileViewScreen ────────────────────────────────────────────────────────
export function ProfileViewScreen() {
  const { state, navigate, goBack, dispatch, showToast, params } = useApp();
  const userId = params.userId as string;
  const user = state.users.find(u => u.id === userId);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [blocking, setBlocking] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-[#0A0A16] items-center justify-center">
        <p className="text-[#7070A0]">Profile not found.</p>
        <Button variant="ghost" onClick={goBack}>Go back</Button>
      </div>
    );
  }

  function handleMessage() {
    const existing = state.conversations.find(c => c.userId === user!.id);
    if (!existing) dispatch({ type: 'CREATE_CONVERSATION', userId: user!.id });
    navigate('chat', { userId: user!.id });
  }

  function handleBlock() {
    setBlocking(true);
    setTimeout(() => {
      dispatch({ type: 'BLOCK_USER', userId: user!.id });
      showToast(`${user!.name} blocked`);
      setBlocking(false);
      setShowBlock(false);
      goBack();
    }, 900);
  }

  const hasPhotos = user.photos.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#0A0A16] overflow-y-auto">
      {/* Photo area */}
      <div className="relative bg-[#141424]" style={{ minHeight: 420 }}>
        {hasPhotos ? (
          <>
            <img
              src={user.photos[photoIndex]}
              alt={user.name}
              className="w-full object-cover cursor-pointer"
              style={{ height: 420 }}
              onClick={() => navigate('photo_viewer', { userId: user.id, photoIndex })}
            />
            {/* Photo dots */}
            {user.photos.length > 1 && (
              <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 px-4">
                {user.photos.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIndex(i)}
                    className={`flex-1 h-1 rounded-full transition-all max-w-12 ${i === photoIndex ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            )}
            {/* Left/right tap zones */}
            {user.photos.length > 1 && (
              <>
                <div className="absolute left-0 top-0 h-full w-1/2"
                  onClick={() => setPhotoIndex(i => Math.max(0, i - 1))} />
                <div className="absolute right-0 top-0 h-full w-1/2"
                  onClick={() => setPhotoIndex(i => Math.min(user.photos.length - 1, i + 1))} />
              </>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center bg-[#1E1E32]" style={{ height: 420 }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-[#2D2D4A] flex items-center justify-center">
                <span className="text-5xl font-bold text-[#FF3D6B]/30">{user.name[0]}</span>
              </div>
              <p className="text-[#4A4A6A] text-sm">No photos</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A0A16] to-transparent" />

        {/* Nav buttons */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">←</button>
          <button onClick={() => setShowMore(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm text-xl">⋯</button>
        </div>

        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 data-heading className="text-3xl font-extrabold text-white">{user.name}, {user.age}</h1>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={user.status} />
                <span className="text-white/60 text-sm">📍 {user.distance.toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="px-5 pb-6 space-y-5 mt-2">
        {/* CTA */}
        <Button variant="primary" fullWidth size="lg" onClick={handleMessage}>
          💬  Message {user.name}
        </Button>

        {/* Bio */}
        {user.bio && (
          <div className="bg-[#141424] rounded-2xl p-4">
            <h3 data-heading className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-2">About</h3>
            <p className="text-[#F0F0FA] leading-relaxed text-[15px]">{user.bio}</p>
          </div>
        )}

        {/* Info grid */}
        <div className="bg-[#141424] rounded-2xl p-4 space-y-3">
          <h3 data-heading className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Details</h3>
          {user.job && (
            <div className="flex items-center gap-3 text-[#F0F0FA]">
              <span className="text-lg">💼</span>
              <span className="text-[15px]">{user.job}</span>
            </div>
          )}
          {user.education && (
            <div className="flex items-center gap-3 text-[#F0F0FA]">
              <span className="text-lg">🎓</span>
              <span className="text-[15px]">{user.education}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-[#F0F0FA]">
            <span className="text-lg">📍</span>
            <span className="text-[15px]">{user.location}</span>
          </div>
          {user.languages && (
            <div className="flex items-center gap-3 text-[#F0F0FA]">
              <span className="text-lg">🗣</span>
              <span className="text-[15px]">{user.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Interests */}
        {user.interests.length > 0 && (
          <div className="bg-[#141424] rounded-2xl p-4">
            <h3 data-heading className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(i => <InterestChip key={i} label={i} />)}
            </div>
          </div>
        )}

        {/* Safety */}
        <div className="flex gap-3">
          <button onClick={() => setShowReport(true)}
            className="flex-1 py-3 rounded-2xl bg-[#1E1E32] text-[#7070A0] text-sm font-medium active:bg-[#262640]">
            ⚑ Report
          </button>
          <button onClick={() => setShowBlock(true)}
            className="flex-1 py-3 rounded-2xl bg-[#1E1E32] text-[#FF4040] text-sm font-medium active:bg-[#FF4040]/10">
            ⊘ Block
          </button>
        </div>

        {user.joinedDaysAgo && (
          <p className="text-[#4A4A6A] text-xs text-center">Member for {user.joinedDaysAgo} days</p>
        )}
      </div>

      {/* More bottom sheet */}
      {showMore && (
        <BottomSheet onClose={() => setShowMore(false)}>
          <div className="py-2 pb-8">
            {[
              { icon: '🔗', label: 'Share Profile', action: () => { showToast('Link copied'); setShowMore(false); } },
              { icon: '🔕', label: 'Hide Profile', action: () => { showToast('Profile hidden'); setShowMore(false); } },
              { icon: '⚑', label: 'Report', action: () => { setShowMore(false); setShowReport(true); } },
              { icon: '⊘', label: 'Block', danger: true, action: () => { setShowMore(false); setShowBlock(true); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-4 ${item.danger ? 'text-[#FF4040]' : 'text-[#F0F0FA]'} active:bg-white/5`}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {showBlock && (
        <Modal
          title={`Block ${user.name}?`}
          body="They will no longer be able to message you or appear in your discovery results."
          confirmLabel="Block"
          cancelLabel="Cancel"
          danger
          loading={blocking}
          onConfirm={handleBlock}
          onCancel={() => setShowBlock(false)}
        />
      )}

      {showReport && (
        <ReportSheet userName={user.name} onClose={() => setShowReport(false)} onSubmit={() => {
          showToast('Report submitted');
          setShowReport(false);
        }} />
      )}
    </div>
  );
}

// ─── ReportSheet ─────────────────────────────────────────────────────────────
function ReportSheet({ userName, onClose, onSubmit }: { userName: string; onClose: () => void; onSubmit: () => void }) {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = ['Fake profile', 'Spam', 'Scam', 'Harassment', 'Inappropriate content', 'Underage', 'Other'];

  function submit() {
    if (!reason) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 1000);
  }

  return (
    <BottomSheet title={`Report ${userName}`} onClose={onClose}>
      <div className="px-5 py-4 space-y-4 pb-8">
        <p className="text-[#7070A0] text-sm">Help us understand what's happening.</p>
        <div className="space-y-2">
          {reasons.map(r => (
            <button key={r} onClick={() => setReason(r)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${reason === r ? 'border-[#FF3D6B] bg-[#FF3D6B]/10 text-[#FF3D6B]' : 'border-white/10 bg-[#1E1E32] text-[#F0F0FA]'}`}>
              <span className="text-sm font-medium">{r}</span>
              {reason === r && <span className="text-[#FF3D6B]">✓</span>}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Additional comments (optional)"
          rows={2}
          className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none text-sm resize-none"
        />
        <Button variant="primary" fullWidth onClick={submit} loading={loading} disabled={!reason}>
          Submit Report
        </Button>
      </div>
    </BottomSheet>
  );
}

// ─── PhotoViewer ──────────────────────────────────────────────────────────────
export function PhotoViewerScreen() {
  const { state, goBack, params } = useApp();
  const userId = params.userId as string;
  const startIndex = (params.photoIndex as number) || 0;
  const user = state.users.find(u => u.id === userId) || state.currentUser;
  const photos = (user as any).photos as string[];

  const [index, setIndex] = useState(startIndex);

  if (!photos?.length) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={goBack} className="text-white text-2xl w-10 h-10 flex items-center justify-center">✕</button>
        <span className="text-white/60 text-sm">{index + 1} / {photos.length}</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center">
        <img src={photos[index]} alt="" className="w-full h-full object-contain" />
      </div>

      {/* Tap zones */}
      {photos.length > 1 && (
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="flex-1 pointer-events-auto" onClick={() => setIndex(i => Math.max(0, i - 1))} />
          <div className="flex-1 pointer-events-auto" onClick={() => setIndex(i => Math.min(photos.length - 1, i + 1))} />
        </div>
      )}

      {/* Dots */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 pb-10">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
