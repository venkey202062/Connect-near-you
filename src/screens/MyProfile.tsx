import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Button, Avatar, Toggle, SettingsRow, Modal, BackHeader, NavBar, EmptyState, RangeSlider } from '../components/ui';
import { Gender } from '../data/mockData';

// ─── MyProfileScreen ──────────────────────────────────────────────────────────
export function MyProfileScreen() {
  const { state, navigate, dispatch, showToast } = useApp();
  const { currentUser } = state;
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);

  const totalUnread = state.conversations.reduce((s, c) => s + c.unreadCount, 0);

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
  }

  function handleDelete() {
    if (deleteStep === 1) { setDeleteStep(2); return; }
    dispatch({ type: 'DELETE_ACCOUNT' });
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-5 pt-14 pb-5">
          <div className="flex items-start justify-between mb-5">
            <h1 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">My Profile</h1>
            <button onClick={() => navigate('edit_profile')} className="text-[#FF3D6B] text-sm font-semibold">Edit</button>
          </div>

          {/* Profile card */}
          <div className="bg-[#141424] rounded-3xl p-5 flex items-center gap-4">
            <button onClick={() => navigate('photo_viewer', { userId: 'me', photoIndex: 0 })}>
              <Avatar user={currentUser} size="xl" />
            </button>
            <div className="flex-1">
              <h2 data-heading className="text-xl font-bold text-[#F0F0FA]">{currentUser.name}, {currentUser.age}</h2>
              <p className="text-[#7070A0] text-sm mt-0.5">{currentUser.location}</p>
              <p className="text-[#B8B8D8] text-sm mt-2 line-clamp-2">{currentUser.bio || 'No bio yet'}</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 px-5 pb-6">
          {/* Account */}
          <div className="bg-[#141424] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Account</span>
            </div>
            <SettingsRow icon="✏️" label="Edit Profile" onPress={() => navigate('edit_profile')} />
            <SettingsRow icon="🖼" label="Edit Photos" onPress={() => navigate('edit_profile')} />
            <SettingsRow icon="⚙️" label="Discovery Settings" onPress={() => navigate('discovery_settings')} last />
          </div>

          {/* Privacy & Safety */}
          <div className="bg-[#141424] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Privacy & Safety</span>
            </div>
            <SettingsRow icon="📍" label="Location Settings" onPress={() => navigate('location_settings')} />
            <SettingsRow icon="👁" label="Privacy Settings" onPress={() => navigate('privacy_settings')} />
            <SettingsRow icon="🛡" label="Safety Centre" onPress={() => navigate('safety_center')} />
            <SettingsRow icon="⊘" label="Blocked Users" value={state.blockedIds.length > 0 ? String(state.blockedIds.length) : ''} onPress={() => navigate('blocked_users')} last />
          </div>

          {/* Preferences */}
          <div className="bg-[#141424] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Preferences</span>
            </div>
            <SettingsRow icon="🔔" label="Notifications" onPress={() => navigate('notification_settings')} />
            <SettingsRow icon="🔒" label="Security" onPress={() => navigate('security_settings')} last />
          </div>

          {/* Danger zone */}
          <div className="bg-[#141424] rounded-2xl overflow-hidden">
            <SettingsRow icon="🚪" label="Log Out" onPress={() => setShowLogout(true)} />
            <SettingsRow icon="🗑" label="Delete Account" onPress={() => setShowDelete(true)} danger last />
          </div>
        </div>
      </div>

      <NavBar active="my_profile" onNavigate={s => navigate(s)} unreadCount={totalUnread} />

      {showLogout && (
        <Modal
          title="Log out of this device?"
          confirmLabel="Log Out"
          cancelLabel="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}

      {showDelete && (
        <Modal
          title={deleteStep === 1 ? 'Delete your account?' : 'Are you absolutely sure?'}
          body={deleteStep === 1
            ? 'This will permanently remove your profile, photos, and conversations. This cannot be undone.'
            : 'This permanently removes your account and all your data. There is no way to recover it.'}
          confirmLabel={deleteStep === 1 ? 'Continue' : 'Delete Account'}
          cancelLabel={deleteStep === 1 ? 'Keep Account' : 'Cancel'}
          danger
          onConfirm={handleDelete}
          onCancel={() => { setShowDelete(false); setDeleteStep(1); }}
        />
      )}
    </div>
  );
}

// ─── EditProfileScreen ────────────────────────────────────────────────────────
export function EditProfileScreen() {
  const { state, goBack, dispatch, showToast } = useApp();
  const { currentUser } = state;
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [job, setJob] = useState(currentUser.job);
  const [education, setEducation] = useState(currentUser.education);
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      dispatch({ type: 'UPDATE_CURRENT_USER', user: { name, bio, job, education } });
      showToast('Profile updated');
      setSaving(false);
      goBack();
    }, 900);
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Edit Profile" onBack={goBack}
        right={<Button variant="primary" size="sm" onClick={save} loading={saving}>Save</Button>} />

      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4 mt-3">
        {/* Photo */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <Avatar user={currentUser} size="2xl" />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FF3D6B] flex items-center justify-center text-white text-sm">+</button>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[#141424] text-[#B8B8D8] text-sm">📷 Take Photo</button>
            <button className="px-4 py-2 rounded-full bg-[#141424] text-[#B8B8D8] text-sm">🖼 Gallery</button>
          </div>
        </div>

        {/* Fields */}
        {[
          { label: 'Name', value: name, set: setName, placeholder: 'Your first name' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-1.5">{f.label}</label>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50" />
          </div>
        ))}

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Bio</label>
            <span className={`text-xs ${bio.length > 220 ? 'text-[#FF7A3D]' : 'text-[#7070A0]'}`}>{bio.length} / 250</span>
          </div>
          <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 250))} rows={4} placeholder="Tell people about yourself…"
            className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50 resize-none" />
        </div>

        <div>
          <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-1.5">Job</label>
          <input value={job} onChange={e => setJob(e.target.value)} placeholder="Your job title"
            className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50" />
        </div>

        <div>
          <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-1.5">Education</label>
          <input value={education} onChange={e => setEducation(e.target.value)} placeholder="University or school"
            className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50" />
        </div>

        <div>
          <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-3">Interests</label>
          <div className="flex flex-wrap gap-2">
            {['Coffee', 'Travel', 'Music', 'Art', 'Sports', 'Food', 'Film', 'Books', 'Gaming', 'Yoga', 'Photography', 'Hiking'].map(interest => {
              const active = currentUser.interests.includes(interest);
              return (
                <button key={interest}
                  onClick={() => dispatch({ type: 'UPDATE_CURRENT_USER', user: { interests: active ? currentUser.interests.filter(i => i !== interest) : [...currentUser.interests, interest] } })}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${active ? 'bg-[#FF3D6B]/15 text-[#FF3D6B] border border-[#FF3D6B]/30' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PrivacySettingsScreen ────────────────────────────────────────────────────
export function PrivacySettingsScreen() {
  const { state, goBack, dispatch, showToast } = useApp();
  const cu = state.currentUser;

  function toggle(key: keyof typeof cu) {
    dispatch({ type: 'UPDATE_CURRENT_USER', user: { [key]: !cu[key] } });
    showToast('Privacy setting updated');
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Privacy" onBack={goBack} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        <p className="text-[#7070A0] text-sm leading-relaxed">Control what others can see about you.</p>
        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <SettingsRow icon="🟢" label="Show online status" toggle toggled={cu.showOnlineStatus} onToggle={() => toggle('showOnlineStatus')} />
          <SettingsRow icon="⏱" label="Show activity status" toggle toggled={cu.showActivityStatus} onToggle={() => toggle('showActivityStatus')} />
          <SettingsRow icon="🔍" label="Show in discovery" toggle toggled={cu.showInDiscovery} onToggle={() => toggle('showInDiscovery')} />
          <SettingsRow icon="💬" label="Allow messages" toggle toggled={cu.allowMessages} onToggle={() => toggle('allowMessages')} last />
        </div>
        <div className="bg-[#FF3D6B]/5 border border-[#FF3D6B]/15 rounded-2xl p-4">
          <p className="text-[#B8B8D8] text-sm">📍 Your exact location is never shown to other users. Only approximate distance is visible.</p>
        </div>
      </div>
    </div>
  );
}

// ─── SafetyCenterScreen ───────────────────────────────────────────────────────
export function SafetyCenterScreen() {
  const { goBack, navigate } = useApp();

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Safety Centre" onBack={goBack} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="bg-gradient-to-r from-[#FF3D6B]/10 to-[#FF7A3D]/10 border border-[#FF3D6B]/20 rounded-2xl p-5">
          <h3 data-heading className="font-bold text-[#F0F0FA] mb-1">Your safety matters</h3>
          <p className="text-[#B8B8D8] text-sm leading-relaxed">Use these tools to stay safe and protect your experience on Nearme.</p>
        </div>

        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <SettingsRow icon="⊘" label="Block Someone" onPress={() => navigate('blocked_users')} />
          <SettingsRow icon="⚑" label="Report a Profile" onPress={() => navigate('discover')} />
          <SettingsRow icon="📋" label="Blocked Users" onPress={() => navigate('blocked_users')} last />
        </div>

        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <span className="text-[#7070A0] text-xs font-semibold uppercase tracking-wider">Safety Tips</span>
          </div>
          {[
            { icon: '📍', title: 'Meet in public', body: 'Always meet for the first time in a public place.' },
            { icon: '📣', title: 'Tell someone', body: 'Let a friend know where you\'re going and who you\'re meeting.' },
            { icon: '🚗', title: 'Get your own ride', body: 'Have your own transport arranged and don\'t rely on your date.' },
            { icon: '📱', title: 'Stay in control', body: 'Keep your phone charged and with you at all times.' },
          ].map(tip => (
            <div key={tip.title} className="flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0">
              <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>
              <div>
                <p className="font-semibold text-[#F0F0FA] text-sm">{tip.title}</p>
                <p className="text-[#7070A0] text-sm mt-0.5">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-4 rounded-2xl bg-[#141424] text-[#B8B8D8] font-semibold">
          Help & Support
        </button>
      </div>
    </div>
  );
}

// ─── BlockedUsersScreen ───────────────────────────────────────────────────────
export function BlockedUsersScreen() {
  const { state, goBack, dispatch, showToast } = useApp();
  const [unblockId, setUnblockId] = useState<string | null>(null);

  const blockedUsers = state.users.filter(u => state.blockedIds.includes(u.id));

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Blocked Users" onBack={goBack} />
      <div className="flex-1 overflow-y-auto">
        {blockedUsers.length === 0 ? (
          <EmptyState icon="✅" title="No blocked users" body="Users you block will appear here." />
        ) : (
          <div className="px-5 py-4 space-y-3">
            {blockedUsers.map(user => (
              <div key={user.id} className="flex items-center gap-4 bg-[#141424] rounded-2xl p-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1E1E32] flex-shrink-0 flex items-center justify-center">
                  {user.photos[0] ? <img src={user.photos[0]} className="w-full h-full object-cover" alt="" /> : <span className="text-xl font-bold text-[#FF3D6B]/30">{user.name[0]}</span>}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#F0F0FA]">{user.name}, {user.age}</p>
                  <p className="text-[#7070A0] text-sm">{user.location}</p>
                </div>
                <button onClick={() => setUnblockId(user.id)}
                  className="px-3 py-1.5 rounded-full bg-[#1E1E32] text-[#B8B8D8] text-sm font-medium">
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {unblockId && (
        <Modal
          title={`Unblock ${state.users.find(u => u.id === unblockId)?.name}?`}
          body="They will be able to appear in discovery and message you again."
          confirmLabel="Unblock"
          cancelLabel="Cancel"
          onConfirm={() => {
            dispatch({ type: 'UNBLOCK_USER', userId: unblockId });
            showToast('User unblocked');
            setUnblockId(null);
          }}
          onCancel={() => setUnblockId(null)}
        />
      )}
    </div>
  );
}

// ─── NotificationSettingsScreen ───────────────────────────────────────────────
export function NotificationSettingsScreen() {
  const { state, goBack, dispatch, showToast } = useApp();
  const cu = state.currentUser;

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Notifications" onBack={goBack} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <SettingsRow icon="💬" label="New messages" toggle toggled={cu.notifyMessages}
            onToggle={() => { dispatch({ type: 'UPDATE_CURRENT_USER', user: { notifyMessages: !cu.notifyMessages } }); showToast('Updated'); }} />
          <SettingsRow icon="📞" label="Calls" toggle toggled={cu.notifyCalls}
            onToggle={() => { dispatch({ type: 'UPDATE_CURRENT_USER', user: { notifyCalls: !cu.notifyCalls } }); showToast('Updated'); }} />
          <SettingsRow icon="👥" label="Profile activity" toggle toggled={cu.notifyActivity}
            onToggle={() => { dispatch({ type: 'UPDATE_CURRENT_USER', user: { notifyActivity: !cu.notifyActivity } }); showToast('Updated'); }} last />
        </div>
      </div>
    </div>
  );
}

// ─── SecuritySettingsScreen ───────────────────────────────────────────────────
export function SecuritySettingsScreen() {
  const { state, goBack, showToast } = useApp();
  const cu = state.currentUser;

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Security" onBack={goBack} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <SettingsRow icon="🔑" label="Change Password" onPress={() => showToast('Password reset email sent', 'info')} />
          <SettingsRow icon="📧" label="Email" value={cu.email} onPress={() => showToast('Email verification sent', 'info')} />
          <SettingsRow icon="📱" label="Phone" value={cu.phone} onPress={() => {}} last />
        </div>
        <div className="bg-[#141424] rounded-2xl overflow-hidden">
          <SettingsRow icon="📱" label="Active sessions" value="1 device" onPress={() => showToast('Showing active sessions', 'info')} />
          <SettingsRow icon="🚪" label="Sign out of all devices" onPress={() => showToast('Signed out of all devices', 'info')} last />
        </div>
      </div>
    </div>
  );
}

// ─── DiscoverySettingsScreen ──────────────────────────────────────────────────
export function DiscoverySettingsScreen() {
  const { state, goBack, dispatch, showToast } = useApp();
  const [filters, setFilters] = useState({ ...state.filters });

  function save() {
    dispatch({ type: 'SET_FILTERS', filters });
    showToast('Discovery settings saved');
    goBack();
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Discovery Settings" onBack={goBack}
        right={<Button variant="primary" size="sm" onClick={save}>Save</Button>} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div className="bg-[#141424] rounded-2xl p-5 space-y-5">
          <RangeSlider min={18} max={filters.ageMax - 1} value={filters.ageMin} onChange={v => setFilters(f => ({ ...f, ageMin: v }))} label="Min Age" />
          <RangeSlider min={filters.ageMin + 1} max={70} value={filters.ageMax} onChange={v => setFilters(f => ({ ...f, ageMax: v }))} label="Max Age" />
          <RangeSlider min={1} max={100} value={filters.distance} onChange={v => setFilters(f => ({ ...f, distance: v }))} label="Distance (km)" />
        </div>

        <div className="bg-[#141424] rounded-2xl p-5">
          <p className="text-[#F0F0FA] font-semibold mb-3">Show me</p>
          <div className="flex gap-2 flex-wrap">
            {([{value:'woman',label:'Women'},{value:'man',label:'Men'},{value:'non-binary',label:'Non-binary'}] as {value:Gender;label:string}[]).map(g => (
              <button key={g.value}
                onClick={() => setFilters(f => ({ ...f, gender: f.gender.includes(g.value) ? f.gender.filter(x => x !== g.value) : [...f.gender, g.value] }))}
                className={`px-4 py-2 rounded-full text-sm font-medium ${filters.gender.includes(g.value) ? 'bg-[#FF3D6B] text-white' : 'bg-[#1E1E32] text-[#B8B8D8]'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LocationSettingsScreen ───────────────────────────────────────────────────
export function LocationSettingsScreen() {
  const { state, goBack, navigate, dispatch, showToast } = useApp();
  const [detecting, setDetecting] = useState(false);

  function useCurrentLocation() {
    setDetecting(true);
    setTimeout(() => {
      dispatch({ type: 'SET_LOCATION', location: 'Central London' });
      showToast('Location updated to Central London');
      setDetecting(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <BackHeader title="Location" onBack={goBack} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="bg-[#141424] rounded-2xl p-5">
          <p className="text-[#7070A0] text-xs uppercase tracking-wider font-semibold mb-1">Searching from</p>
          <div className="flex items-center gap-2">
            <span className="text-[#FF3D6B] text-xl">📍</span>
            <span className="text-[#F0F0FA] font-bold text-lg">{state.location}</span>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4">
          <p className="text-emerald-400 text-sm">🔒 Your exact location is never shown to other users.</p>
        </div>

        <div className="space-y-3">
          <Button variant="primary" fullWidth onClick={useCurrentLocation} loading={detecting}>
            📍  Use Current Location
          </Button>
          <Button variant="outline" fullWidth onClick={() => navigate('map')}>
            🗺  Choose on Map
          </Button>
        </div>
      </div>
    </div>
  );
}
