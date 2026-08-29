import { ReactNode, useEffect, useRef } from 'react';
import { User, OnlineStatus } from '../data/mockData';

// ─── Avatar ─────────────────────────────────────────────────────────────────
interface AvatarProps {
  user?: { name: string; photos: string[] };
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showStatus?: boolean;
  status?: OnlineStatus;
  className?: string;
}

const sizeMap = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-28 h-28 text-3xl',
};

const statusDotSize = { xs: 'w-2 h-2', sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-3.5 h-3.5', xl: 'w-4 h-4', '2xl': 'w-5 h-5' };

export function Avatar({ user, src, name, size = 'md', showStatus, status, className = '' }: AvatarProps) {
  const photo = src || (user?.photos?.[0]);
  const displayName = name || user?.name || '?';
  const initials = displayName.slice(0, 1).toUpperCase();
  const isOnline = status === 'online';
  const isRecent = status === 'active_5min' || status === 'active_1hr';

  const dotColor = isOnline ? 'bg-emerald-400' : isRecent ? 'bg-yellow-400' : 'bg-gray-500';

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div className={`${sizeMap[size]} rounded-full overflow-hidden bg-[#2D2D4A] flex items-center justify-center`}>
        {photo ? (
          <img src={photo} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className={`font-semibold text-[#FF3D6B] ${sizeMap[size].split(' ')[2]}`}>{initials}</span>
        )}
      </div>
      {showStatus && status && (
        <span className={`absolute bottom-0 right-0 ${statusDotSize[size]} rounded-full ${dotColor} ring-2 ring-[#0A0A16]`} />
      )}
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled, loading, fullWidth, className = '', type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-150 select-none active:scale-[0.97]';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3.5 text-[15px]', lg: 'px-8 py-4 text-base' };
  const variants = {
    primary: 'bg-[#FF3D6B] text-white active:bg-[#e63360] disabled:opacity-40',
    secondary: 'bg-[#1E1E32] text-[#B8B8D8] active:bg-[#262640]',
    ghost: 'bg-transparent text-[#B8B8D8] active:bg-white/5',
    danger: 'bg-[#FF3D3D]/10 text-[#FF3D3D] active:bg-[#FF3D3D]/20',
    outline: 'border border-white/10 text-[#F0F0FA] active:bg-white/5',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 18} /> : children}
    </button>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color = '#FF3D6B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: OnlineStatus }) {
  const map: Record<OnlineStatus, { color: string; dot: string; label: string }> = {
    online: { color: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Online' },
    active_5min: { color: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Active 5 min ago' },
    active_1hr: { color: 'text-yellow-500/80', dot: 'bg-yellow-500', label: 'Active 1 hr ago' },
    active_today: { color: 'text-slate-400', dot: 'bg-slate-400', label: 'Active today' },
    offline: { color: 'text-gray-500', dot: 'bg-gray-500', label: 'Offline' },
  };
  const { color, dot, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts }: { toasts: { id: string; text: string; type: string }[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 340 }}>
      {toasts.map(t => (
        <div key={t.id} className="fade-in px-4 py-3 rounded-2xl text-sm font-medium shadow-xl backdrop-blur-sm"
          style={{
            background: t.type === 'error' ? '#FF3D3D22' : t.type === 'info' ? '#3D7FFF22' : '#00C87522',
            color: t.type === 'error' ? '#FF8080' : t.type === 'info' ? '#80AAFF' : '#60E0A0',
            border: `1px solid ${t.type === 'error' ? '#FF3D3D44' : t.type === 'info' ? '#3D7FFF44' : '#00C87544'}`,
          }}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
}

export function Modal({ title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger, loading }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="slide-up w-full max-w-[390px] bg-[#141424] rounded-t-3xl px-6 py-8 pb-10">
        <h3 data-heading className="text-lg font-bold text-[#F0F0FA] mb-2">{title}</h3>
        {body && <p className="text-[#7070A0] text-sm leading-relaxed mb-6">{body}</p>}
        <div className="flex flex-col gap-3">
          <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" fullWidth onClick={onCancel}>{cancelLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ─── BottomSheet ─────────────────────────────────────────────────────────────
interface BottomSheetProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ title, onClose, children, className = '' }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('touchstart', handler);
    return () => document.removeEventListener('touchstart', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`slide-up w-full max-w-[390px] bg-[#141424] rounded-t-3xl ${className}`}>
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <h3 data-heading className="font-bold text-[#F0F0FA]">{title}</h3>
            <button onClick={onClose} className="text-[#7070A0] text-2xl leading-none p-1">✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── FilterChip ──────────────────────────────────────────────────────────────
export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FF3D6B]/15 text-[#FF3D6B] text-xs font-medium">
      {label}
      <button onClick={onRemove} className="text-[#FF3D6B] opacity-70 hover:opacity-100 ml-0.5">✕</button>
    </span>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-[#141424] rounded-3xl overflow-hidden">
      <div className="shimmer w-full aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-4 w-2/3 rounded-full" />
        <div className="shimmer h-3 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

// ─── SkeletonRow ─────────────────────────────────────────────────────────────
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="shimmer w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-4 w-1/2 rounded-full" />
        <div className="shimmer h-3 w-3/4 rounded-full" />
      </div>
    </div>
  );
}

// ─── RangeSlider ─────────────────────────────────────────────────────────────
interface RangeSliderProps {
  min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void; label?: string;
}

export function RangeSlider({ min, max, step = 1, value, onChange, label }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      {label && <div className="flex justify-between text-sm mb-2"><span className="text-[#7070A0]">{label}</span><span className="text-[#F0F0FA] font-semibold">{value}</span></div>}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 rounded-full bg-[#1E1E32]">
          <div className="h-full rounded-full bg-[#FF3D6B]" style={{ width: `${pct}%` }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <div className="absolute w-5 h-5 rounded-full bg-white shadow-lg border-2 border-[#FF3D6B] pointer-events-none"
          style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${checked ? 'bg-[#FF3D6B]' : 'bg-[#2D2D4A]'}`}
    >
      <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

// ─── ProfileCardCompact ───────────────────────────────────────────────────────
interface ProfileCardCompactProps {
  user: User;
  onPress: () => void;
  onMessage: () => void;
}

export function ProfileCardCompact({ user, onPress, onMessage }: ProfileCardCompactProps) {
  const hasPhoto = user.photos.length > 0;
  return (
    <div className="bg-[#141424] rounded-3xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform" onClick={onPress}>
      <div className="relative aspect-[3/4] bg-[#1E1E32]">
        {hasPhoto ? (
          <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl font-bold text-[#FF3D6B]/30">{user.name[0]}</span>
          </div>
        )}
        {/* Online dot */}
        {(user.status === 'online' || user.status === 'active_5min') && (
          <span className={`absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-[#141424] ${user.status === 'online' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
        )}
        {/* Photo count */}
        {user.photos.length > 1 && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            1/{user.photos.length}
          </span>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-white font-bold text-base leading-tight">{user.name}, {user.age}</div>
          <div className="text-white/60 text-xs mt-0.5">📍 {user.distance.toFixed(1)} km</div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-2.5">
          {user.interests.slice(0, 2).map(i => (
            <span key={i} className="bg-[#1E1E32] text-[#B8B8D8] text-[10px] px-2 py-0.5 rounded-full">{i}</span>
          ))}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onMessage(); }}
          className="w-full py-2 rounded-xl bg-[#FF3D6B]/10 text-[#FF3D6B] text-sm font-semibold active:bg-[#FF3D6B]/20 transition-colors"
        >
          Message
        </button>
      </div>
    </div>
  );
}

// ─── InterestChip ────────────────────────────────────────────────────────────
export function InterestChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1E1E32] text-[#B8B8D8] text-sm">{label}</span>
  );
}

// ─── NavBar ──────────────────────────────────────────────────────────────────
interface NavBarProps {
  active: 'discover' | 'search' | 'chat_list' | 'my_profile';
  onNavigate: (s: 'discover' | 'search' | 'chat_list' | 'my_profile') => void;
  unreadCount?: number;
}

export function NavBar({ active, onNavigate, unreadCount = 0 }: NavBarProps) {
  const items: { id: NavBarProps['active']; label: string; icon: string }[] = [
    { id: 'discover', label: 'Discover', icon: '◈' },
    { id: 'search', label: 'Search', icon: '⊙' },
    { id: 'chat_list', label: 'Chats', icon: '◎' },
    { id: 'my_profile', label: 'Profile', icon: '○' },
  ];

  return (
    <div className="safe-bottom bg-[#0A0A16] border-t border-white/5">
      <div className="flex items-center">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              active === item.id ? 'text-[#FF3D6B]' : 'text-[#7070A0]'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.id === 'chat_list' && unreadCount > 0 && (
              <span className="absolute top-2 right-[calc(50%-14px)] w-4 h-4 flex items-center justify-center rounded-full bg-[#FF3D6B] text-white text-[9px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── BackHeader ──────────────────────────────────────────────────────────────
interface BackHeaderProps {
  title?: string;
  onBack: () => void;
  right?: ReactNode;
  transparent?: boolean;
}

export function BackHeader({ title, onBack, right, transparent }: BackHeaderProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${transparent ? '' : 'bg-[#0A0A16] border-b border-white/5'}`}>
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-[#F0F0FA] text-lg">
        ←
      </button>
      {title && <h2 data-heading className="flex-1 font-bold text-[#F0F0FA] text-base">{title}</h2>}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
interface EmptyStateProps { icon: string; title: string; body?: string; action?: ReactNode; }

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <span className="text-5xl">{icon}</span>
      <div>
        <h3 data-heading className="font-bold text-[#F0F0FA] text-lg mb-1">{title}</h3>
        {body && <p className="text-[#7070A0] text-sm leading-relaxed">{body}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── SettingsRow ─────────────────────────────────────────────────────────────
interface SettingsRowProps {
  icon: string; label: string; value?: string;
  onPress?: () => void; toggle?: boolean; toggled?: boolean; onToggle?: (v: boolean) => void;
  danger?: boolean; last?: boolean;
}

export function SettingsRow({ icon, label, value, onPress, toggle, toggled, onToggle, danger, last }: SettingsRowProps) {
  return (
    <button
      onClick={toggle ? undefined : onPress}
      className={`w-full flex items-center gap-4 px-5 py-4 ${last ? '' : 'border-b border-white/5'} ${danger ? 'text-[#FF4040]' : 'text-[#F0F0FA]'} active:bg-white/3 text-left`}
    >
      <span className="text-xl w-6 text-center">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {toggle ? (
        <Toggle checked={toggled ?? false} onChange={onToggle ?? (() => {})} />
      ) : (
        <>
          {value && <span className="text-[#7070A0] text-sm mr-2">{value}</span>}
          {onPress && <span className="text-[#7070A0]">›</span>}
        </>
      )}
    </button>
  );
}
