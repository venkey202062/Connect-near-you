import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { Button, FilterChip, SkeletonCard, EmptyState, ProfileCardCompact, RangeSlider, BottomSheet, NavBar } from '../components/ui';
import { Filters, defaultFilters, User, Gender } from '../data/mockData';

// ─── DiscoverScreen ───────────────────────────────────────────────────────────
export function DiscoverScreen() {
  const { state, navigate, dispatch, showToast } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const { filters, blockedIds, location } = state;

  const activeFilters = useMemo(() => {
    const chips: { label: string; key: string }[] = [];
    if (filters.ageMin !== 18 || filters.ageMax !== 45)
      chips.push({ label: `${filters.ageMin}–${filters.ageMax} yrs`, key: 'age' });
    if (filters.distance !== 50)
      chips.push({ label: `${filters.distance} km`, key: 'distance' });
    if (filters.availability !== 'everyone')
      chips.push({ label: filters.availability === 'online' ? 'Online now' : 'Recently active', key: 'avail' });
    if (filters.photos !== 'everyone')
      chips.push({ label: filters.photos === 'with_photos' ? 'With photos' : 'No photos', key: 'photos' });
    return chips;
  }, [filters]);

  const visibleUsers = useMemo(() => {
    return state.users.filter(u => {
      if (blockedIds.includes(u.id)) return false;
      if (u.age < filters.ageMin || u.age > filters.ageMax) return false;
      if (u.distance > filters.distance) return false;
      if (filters.availability === 'online' && u.status !== 'online') return false;
      if (filters.availability === 'recent' && u.status !== 'online' && u.status !== 'active_5min' && u.status !== 'active_1hr') return false;
      if (filters.photos === 'with_photos' && u.photos.length === 0) return false;
      if (filters.photos === 'without_photos' && u.photos.length > 0) return false;
      if (!filters.gender.includes(u.gender)) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'distance') return a.distance - b.distance;
      if (filters.sort === 'active') return ['online','active_5min','active_1hr','active_today','offline'].indexOf(a.status) - ['online','active_5min','active_1hr','active_today','offline'].indexOf(b.status);
      if (filters.sort === 'new') return (a.joinedDaysAgo ?? 99) - (b.joinedDaysAgo ?? 99);
      return 0;
    });
  }, [state.users, blockedIds, filters]);

  function removeFilter(key: string) {
    const f = { ...filters };
    if (key === 'age') { f.ageMin = 18; f.ageMax = 45; }
    if (key === 'distance') f.distance = 50;
    if (key === 'avail') f.availability = 'everyone';
    if (key === 'photos') f.photos = 'everyone';
    dispatch({ type: 'SET_FILTERS', filters: f });
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Updated people nearby');
    }, 1200);
  }

  function goToProfile(user: User) {
    navigate('profile_view', { userId: user.id });
  }

  function goToMessage(user: User) {
    const existing = state.conversations.find(c => c.userId === user.id);
    if (!existing) {
      dispatch({ type: 'CREATE_CONVERSATION', userId: user.id });
    }
    const convId = existing?.id || `c_${user.id}_${Date.now()}`;
    navigate('chat', { userId: user.id, conversationId: convId });
  }

  const totalUnread = state.conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      {/* Header */}
      <div className="px-5 pt-14 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">People near you</h1>
            <button onClick={() => navigate('location_settings')} className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#FF3D6B] text-xs">📍</span>
              <span className="text-[#FF3D6B] text-sm font-medium">{location}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => navigate('map')} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8] text-sm">
              ⊙
            </button>
            <button onClick={handleRefresh} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8] text-sm">
              ↻
            </button>
            <button onClick={() => setShowFilters(true)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm ${activeFilters.length > 0 ? 'bg-[#FF3D6B] text-white' : 'bg-[#141424] text-[#B8B8D8]'}`}>
              ⊟
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {activeFilters.map(chip => (
              <FilterChip key={chip.key} label={chip.label} onRemove={() => removeFilter(chip.key)} />
            ))}
            <button onClick={() => dispatch({ type: 'SET_FILTERS', filters: defaultFilters })}
              className="text-[#7070A0] text-xs px-2 py-1 underline">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {isRefreshing && (
          <div className="text-center text-[#7070A0] text-sm py-3 flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF3D6B] animate-pulse" />
            Updating people nearby…
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : visibleUsers.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No profiles match"
            body={activeFilters.length > 0 ? 'Try adjusting your filters or expanding your search area.' : 'No one nearby yet. Try expanding your search area or changing your location.'}
            action={
              <div className="flex flex-col gap-2 w-full">
                {activeFilters.length > 0 && (
                  <Button variant="primary" onClick={() => setShowFilters(true)}>Adjust Filters</Button>
                )}
                <Button variant="outline" onClick={() => navigate('location_settings')}>Change Location</Button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {visibleUsers.map(user => (
              <ProfileCardCompact
                key={user.id}
                user={user}
                onPress={() => goToProfile(user)}
                onMessage={() => goToMessage(user)}
              />
            ))}
          </div>
        )}
      </div>

      <NavBar
        active="discover"
        onNavigate={s => navigate(s)}
        unreadCount={totalUnread}
      />

      {showFilters && (
        <FiltersSheet
          filters={filters}
          userCount={visibleUsers.length}
          onApply={f => {
            dispatch({ type: 'SET_FILTERS', filters: f });
            setShowFilters(false);
            showToast('Filters applied');
          }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

// ─── FiltersSheet ─────────────────────────────────────────────────────────────
interface FiltersSheetProps {
  filters: Filters;
  userCount: number;
  onApply: (f: Filters) => void;
  onClose: () => void;
}

export function FiltersSheet({ filters, userCount, onApply, onClose }: FiltersSheetProps) {
  const [local, setLocal] = useState<Filters>({ ...filters });

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'woman', label: 'Women' },
    { value: 'man', label: 'Men' },
    { value: 'non-binary', label: 'Non-binary' },
  ];

  function toggleGender(g: Gender) {
    setLocal(l => ({
      ...l,
      gender: l.gender.includes(g) ? l.gender.filter(x => x !== g) : [...l.gender, g],
    }));
  }

  const estimatedCount = useMemo(() => {
    return Math.max(0, userCount + Math.floor(Math.random() * 10));
  }, [local]);

  return (
    <BottomSheet title="Filters" onClose={onClose} className="max-h-[90vh] overflow-y-auto">
      <div className="px-5 py-5 space-y-6">
        {/* Age */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#F0F0FA] font-semibold">Age</span>
            <span className="text-[#FF3D6B] font-semibold text-sm">{local.ageMin}–{local.ageMax}</span>
          </div>
          <div className="space-y-3">
            <RangeSlider min={18} max={local.ageMax - 1} value={local.ageMin} onChange={v => setLocal(l => ({ ...l, ageMin: v }))} label="Min" />
            <RangeSlider min={local.ageMin + 1} max={70} value={local.ageMax} onChange={v => setLocal(l => ({ ...l, ageMax: v }))} label="Max" />
          </div>
        </div>

        {/* Distance */}
        <div>
          <RangeSlider min={1} max={100} value={local.distance} onChange={v => setLocal(l => ({ ...l, distance: v }))} label="Distance (km)" />
        </div>

        {/* Availability */}
        <div>
          <span className="text-[#F0F0FA] font-semibold block mb-3">Availability</span>
          <div className="flex gap-2 flex-wrap">
            {(['everyone', 'online', 'recent'] as const).map(a => (
              <button key={a}
                onClick={() => setLocal(l => ({ ...l, availability: a }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${local.availability === a ? 'bg-[#FF3D6B] text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                {a === 'everyone' ? 'Everyone' : a === 'online' ? 'Online now' : 'Recently active'}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div>
          <span className="text-[#F0F0FA] font-semibold block mb-3">Photos</span>
          <div className="flex gap-2 flex-wrap">
            {(['everyone', 'with_photos', 'without_photos'] as const).map(p => (
              <button key={p}
                onClick={() => setLocal(l => ({ ...l, photos: p }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${local.photos === p ? 'bg-[#FF3D6B] text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                {p === 'everyone' ? 'Everyone' : p === 'with_photos' ? 'With photos' : 'Without photos'}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <span className="text-[#F0F0FA] font-semibold block mb-3">Gender</span>
          <div className="flex gap-2 flex-wrap">
            {genderOptions.map(g => (
              <button key={g.value}
                onClick={() => toggleGender(g.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${local.gender.includes(g.value) ? 'bg-[#FF3D6B] text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <span className="text-[#F0F0FA] font-semibold block mb-3">Sort by</span>
          <div className="flex gap-2 flex-wrap">
            {(['distance', 'active', 'new', 'relevance'] as const).map(s => (
              <button key={s}
                onClick={() => setLocal(l => ({ ...l, sort: s }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${local.sort === s ? 'bg-[#FF3D6B] text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                {s === 'distance' ? 'Distance' : s === 'active' ? 'Recently active' : s === 'new' ? 'New users' : 'Relevance'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/5 flex gap-3">
        <Button variant="secondary" onClick={() => setLocal(defaultFilters)}>Reset</Button>
        <Button variant="primary" fullWidth onClick={() => onApply(local)}>
          Show {estimatedCount} people
        </Button>
      </div>
    </BottomSheet>
  );
}

// ─── SearchScreen ─────────────────────────────────────────────────────────────
export function SearchScreen() {
  const { state, navigate, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');

  const totalUnread = state.conversations.reduce((s, c) => s + c.unreadCount, 0);
  const { filters, blockedIds } = state;

  const results = useMemo(() => {
    return state.users.filter(u => {
      if (blockedIds.includes(u.id)) return false;
      if (!query) return true;
      return (
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.interests.some(i => i.toLowerCase().includes(query.toLowerCase())) ||
        (u.job || '').toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [state.users, blockedIds, query]);

  function goToMessage(user: User) {
    const existing = state.conversations.find(c => c.userId === user.id);
    if (!existing) dispatch({ type: 'CREATE_CONVERSATION', userId: user.id });
    navigate('chat', { userId: user.id });
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <div className="px-5 pt-14 pb-3">
        <h1 data-heading className="text-2xl font-extrabold text-[#F0F0FA] mb-4">Search</h1>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7070A0]">⊙</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, interest, job…"
            className="w-full bg-[#141424] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50"
          />
        </div>
        <div className="flex gap-1 bg-[#141424] p-1 rounded-2xl">
          {(['list', 'map'] as const).map(v => (
            <button key={v} onClick={() => v === 'map' ? navigate('map') : setView('list')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${view === v ? 'bg-[#FF3D6B] text-white' : 'text-[#7070A0]'}`}>
              {v === 'list' ? '≡ List' : '⊙ Map'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {results.length === 0 ? (
          <EmptyState icon="🔍" title="No results" body="Try a different name or interest." />
        ) : (
          <div className="px-5 space-y-3">
            {results.map(user => (
              <button key={user.id}
                onClick={() => navigate('profile_view', { userId: user.id })}
                className="w-full flex items-center gap-4 bg-[#141424] rounded-2xl p-3 text-left active:opacity-80">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1E1E32] flex-shrink-0 flex items-center justify-center">
                  {user.photos[0] ? (
                    <img src={user.photos[0]} className="w-full h-full object-cover" alt={user.name} />
                  ) : (
                    <span className="text-xl font-bold text-[#FF3D6B]/50">{user.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F0F0FA]">{user.name}, {user.age}</span>
                    {user.status === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[#7070A0] text-sm">{user.distance.toFixed(1)} km · {user.job || user.interests[0]}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {user.interests.slice(0, 2).map(i => (
                      <span key={i} className="bg-[#1E1E32] text-[#B8B8D8] text-[10px] px-2 py-0.5 rounded-full">{i}</span>
                    ))}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); goToMessage(user); }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF3D6B]/10 text-[#FF3D6B] flex-shrink-0">
                  ✉
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      <NavBar active="search" onNavigate={s => navigate(s)} unreadCount={totalUnread} />
    </div>
  );
}
