import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Button, Spinner } from '../components/ui';
import { Gender } from '../data/mockData';

// ─── Splash ───────────────────────────────────────────────────────────────────
export function SplashScreen() {
  const { navigate, resetNav, state } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isLoggedIn) {
        resetNav('discover');
      } else {
        resetNav('welcome');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0A0A16]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF3D6B] to-[#FF7A3D] flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl">♡</span>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF3D6B] to-[#FF7A3D] opacity-40 blur-xl scale-125" />
        </div>
        <div className="text-center">
          <h1 data-heading className="text-3xl font-extrabold text-white tracking-tight">Nearme</h1>
          <p className="text-[#7070A0] text-sm mt-1">Find people nearby</p>
        </div>
        <Spinner size={24} />
      </div>
    </div>
  );
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
export function WelcomeScreen() {
  const { navigate, state, toggleTheme } = useApp();
  return (
    <div className="relative flex flex-col h-full bg-[#0A0A16] overflow-hidden">
      {/* Background image collage */}
      <div className="absolute inset-0 grid grid-cols-2 gap-1 opacity-30">
        {[
          'photo-1544005313-94ddf0286df2',
          'photo-1500648767791-00dcc994a43e',
          'photo-1580489944761-15a19d654956',
          'photo-1507003211169-0a1dd7228f2d',
        ].map((id, i) => (
          <div key={i} className="overflow-hidden" style={{ height: '50%' }}>
            <img
              src={`https://images.unsplash.com/${id}?w=200&h=300&fit=crop&auto=format`}
              alt="" className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A16]/60 via-transparent to-[#0A0A16]" />

      {/* Logo */}
      <div className="relative flex items-center gap-2 p-6 pt-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3D6B] to-[#FF7A3D] flex items-center justify-center">
          <span className="text-white text-lg">♡</span>
        </div>
        <span data-heading className="text-white font-extrabold text-xl">Nearme</span>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
          className="ml-auto w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center"
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Content */}
      <div className="relative mt-auto px-6 pb-12">
        <h1 data-heading className="text-4xl font-extrabold text-white leading-tight mb-3">
          Meet people<br />around you.
        </h1>
        <p className="text-[#B8B8D8] text-base leading-relaxed mb-10">
          Discover people nearby, chat instantly and connect based on where you are.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('onboarding')}>
            Create Account
          </Button>
          <Button variant="outline" fullWidth size="lg" onClick={() => navigate('login')}>
            Log In
          </Button>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#F0F0FA] text-sm font-semibold active:bg-white/10">
              <span>G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#F0F0FA] text-sm font-semibold active:bg-white/10">
              <span>🍎</span> Apple
            </button>
          </div>
        </div>
        <p className="text-[#4A4A6A] text-xs text-center mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}


// ─── Login ────────────────────────────────────────────────────────────────────
export function LoginScreen() {
  const { goBack, resetNav, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!email.trim() || !password) {
      showToast('Enter your email and password', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Signed in successfully');
      resetNav('discover');
    }, 900);
  }

  function handleProvider(name: string) {
    showToast(`${name} sign-in is ready for integration`, 'info');
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <div className="px-5 pt-5">
        <button onClick={goBack} className="text-[#B8B8D8] text-2xl" aria-label="Go back">←</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="pt-8 pb-6">
          <h1 data-heading className="text-3xl font-extrabold text-[#F0F0FA]">Welcome back</h1>
          <p className="text-[#7070A0] mt-2 leading-relaxed">
            Log in to continue meeting people near you.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50"
            />
          </div>

          <div>
            <label className="block text-[#7070A0] text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#141424] border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7070A0] text-sm px-2 py-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => setRememberMe(v => !v)}
              className="flex items-center gap-2 text-[#B8B8D8] text-sm"
            >
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${rememberMe ? 'bg-[#FF3D6B] border-[#FF3D6B] text-white' : 'border-white/15'}`}>
                {rememberMe ? '✓' : ''}
              </span>
              Remember me
            </button>
            <button
              type="button"
              onClick={() => showToast('Password reset flow will be connected to email authentication', 'info')}
              className="text-[#FF3D6B] text-sm font-semibold"
            >
              Forgot password?
            </button>
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={handleLogin} loading={loading}>
            Log In
          </Button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[#7070A0] text-xs uppercase tracking-wider">or continue with</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="space-y-3">
          <button onClick={() => handleProvider('Google')} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-[#141424] border border-white/10 text-[#F0F0FA] font-semibold">
            <span className="text-base font-bold">G</span> Continue with Google
          </button>
          <button onClick={() => handleProvider('Apple')} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-[#141424] border border-white/10 text-[#F0F0FA] font-semibold">
            <span></span> Continue with Apple
          </button>
          <button onClick={() => handleProvider('Phone')} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-[#141424] border border-white/10 text-[#F0F0FA] font-semibold">
            <span>📱</span> Continue with phone number
          </button>
        </div>

        <p className="text-[#7070A0] text-sm text-center mt-7">
          New to Nearme?{' '}
          <button onClick={() => resetNav('onboarding')} className="text-[#FF3D6B] font-semibold">Create an account</button>
        </p>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
type OBStep = 'name_age' | 'gender' | 'preferences' | 'photos' | 'bio' | 'done';

const STEPS: OBStep[] = ['name_age', 'gender', 'preferences', 'photos', 'bio'];

interface OBData {
  firstName: string;
  dob: string;
  gender: Gender | '';
  preferences: Gender[];
  photos: string[];
  bio: string;
}

export function OnboardingScreen() {
  const { navigate, resetNav, dispatch, showToast } = useApp();
  const [step, setStep] = useState<OBStep>('name_age');
  const [data, setData] = useState<OBData>({
    firstName: '', dob: '', gender: '', preferences: [], photos: [], bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function calcAge(dob: string) {
    if (!dob) return 0;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
    return age;
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 'name_age') {
      if (!data.firstName.trim()) e.name = 'Name is required';
      if (!data.dob) { e.dob = 'Date of birth is required'; }
      else if (calcAge(data.dob) < 18) { e.dob = 'You must be at least 18 to use this app.'; }
    }
    if (step === 'gender' && !data.gender) e.gender = 'Please select an option';
    if (step === 'preferences' && !data.preferences.length) e.pref = 'Please select at least one option';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (!validateStep()) return;
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]);
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_CURRENT_USER',
        user: {
          name: data.firstName,
          dob: data.dob,
          gender: data.gender as Gender,
          preferences: data.preferences,
          bio: data.bio,
          photos: data.photos,
        },
      });
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      navigate('location_perm');
      setLoading(false);
    }, 1200);
  }

  function togglePref(g: Gender) {
    setData(d => ({
      ...d,
      preferences: d.preferences.includes(g)
        ? d.preferences.filter(p => p !== g)
        : [...d.preferences, g],
    }));
  }

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'woman', label: 'Woman' },
    { value: 'man', label: 'Man' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer_not', label: 'Prefer not to say' },
  ];

  const age = calcAge(data.dob);
  const bioLen = data.bio.length;

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      {/* Progress header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {stepIndex > 0 && (
            <button onClick={() => setStep(STEPS[stepIndex - 1])} className="text-[#7070A0] text-2xl">←</button>
          )}
          <div className="flex-1 h-1 bg-[#1E1E32] rounded-full">
            <div className="h-full bg-[#FF3D6B] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[#7070A0] text-xs">{stepIndex + 1}/{STEPS.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {step === 'name_age' && (
          <div className="fade-in space-y-6">
            <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">What's your name?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[#7070A0] text-xs font-medium mb-1.5 uppercase tracking-wider">First Name</label>
                <input
                  value={data.firstName}
                  onChange={e => { setData(d => ({ ...d, firstName: e.target.value })); setErrors({}); }}
                  placeholder="Enter your first name"
                  className={`w-full bg-[#141424] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50 transition-colors`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[#7070A0] text-xs font-medium mb-1.5 uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  value={data.dob}
                  onChange={e => { setData(d => ({ ...d, dob: e.target.value })); setErrors({}); }}
                  max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
                  className={`w-full bg-[#141424] border ${errors.dob ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-[#F0F0FA] outline-none focus:border-[#FF3D6B]/50 transition-colors`}
                  style={{ colorScheme: 'dark' }}
                />
                {errors.dob ? (
                  <p className="text-red-400 text-xs mt-1">{errors.dob}</p>
                ) : data.dob && age >= 18 ? (
                  <p className="text-[#60E0A0] text-xs mt-1">Age: {age}</p>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {step === 'gender' && (
          <div className="fade-in space-y-6">
            <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">How do you identify?</h2>
            <div className="space-y-3">
              {genderOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setData(d => ({ ...d, gender: opt.value })); setErrors({}); }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all ${
                    data.gender === opt.value
                      ? 'border-[#FF3D6B] bg-[#FF3D6B]/10 text-[#FF3D6B]'
                      : 'border-white/10 bg-[#141424] text-[#F0F0FA]'
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  {data.gender === opt.value && <span className="text-[#FF3D6B]">✓</span>}
                </button>
              ))}
              {errors.gender && <p className="text-red-400 text-xs">{errors.gender}</p>}
            </div>
          </div>
        )}

        {step === 'preferences' && (
          <div className="fade-in space-y-6">
            <div>
              <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">Who would you like to discover?</h2>
              <p className="text-[#7070A0] text-sm mt-1">Select all that apply. You can change this later.</p>
            </div>
            <div className="space-y-3">
              {genderOptions.slice(0, 3).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => togglePref(opt.value)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all ${
                    data.preferences.includes(opt.value)
                      ? 'border-[#FF3D6B] bg-[#FF3D6B]/10 text-[#FF3D6B]'
                      : 'border-white/10 bg-[#141424] text-[#F0F0FA]'
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  {data.preferences.includes(opt.value) && <span className="text-[#FF3D6B]">✓</span>}
                </button>
              ))}
              {errors.pref && <p className="text-red-400 text-xs">{errors.pref}</p>}
            </div>
          </div>
        )}

        {step === 'photos' && (
          <div className="fade-in space-y-6">
            <div>
              <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">Add a profile photo</h2>
              <p className="text-[#7070A0] text-sm mt-1">Profiles with photos get far more connections.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`aspect-square rounded-2xl ${i < data.photos.length ? 'bg-[#1E1E32]' : 'bg-[#141424] border-2 border-dashed border-white/10'} flex items-center justify-center cursor-pointer active:opacity-70`}
                  onClick={() => {
                    if (i === data.photos.length) {
                      setData(d => ({ ...d, photos: [...d.photos, `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&auto=format`] }));
                    }
                  }}>
                  {i < data.photos.length ? (
                    <img src={data.photos[i]} className="w-full h-full object-cover rounded-2xl" alt="" />
                  ) : (
                    <span className="text-2xl text-[#4A4A6A]">+</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" fullWidth onClick={() => setData(d => ({ ...d, photos: [...d.photos, `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&auto=format`] }))}>
                📷  Take Photo
              </Button>
              <Button variant="outline" fullWidth onClick={() => setData(d => ({ ...d, photos: [...d.photos, `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&auto=format`] }))}>
                🖼  Choose from Gallery
              </Button>
            </div>
          </div>
        )}

        {step === 'bio' && (
          <div className="fade-in space-y-6">
            <div>
              <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">Tell people about yourself</h2>
              <p className="text-[#7070A0] text-sm mt-1">A good bio gets far more conversations started.</p>
            </div>
            <div>
              <textarea
                value={data.bio}
                onChange={e => setData(d => ({ ...d, bio: e.target.value.slice(0, 250) }))}
                placeholder="Write a short bio about yourself..."
                rows={5}
                className="w-full bg-[#141424] border border-white/10 rounded-2xl px-4 py-3.5 text-[#F0F0FA] placeholder-[#4A4A6A] outline-none focus:border-[#FF3D6B]/50 transition-colors resize-none"
              />
              <p className={`text-right text-xs mt-1 ${bioLen > 220 ? 'text-[#FF7A3D]' : 'text-[#7070A0]'}`}>{bioLen} / 250</p>
            </div>
            <div>
              <p className="text-[#7070A0] text-sm mb-3">Add interests</p>
              <div className="flex flex-wrap gap-2">
                {['Coffee', 'Travel', 'Music', 'Art', 'Sports', 'Food', 'Film', 'Books', 'Gaming', 'Yoga'].map(interest => (
                  <button key={interest}
                    onClick={() => {}}
                    className="px-3 py-1.5 rounded-full bg-[#1E1E32] text-[#B8B8D8] text-sm active:bg-[#FF3D6B]/15 active:text-[#FF3D6B] transition-colors">
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-10 pt-4 space-y-3">
        <Button variant="primary" fullWidth size="lg" onClick={nextStep} loading={loading}>
          {stepIndex === STEPS.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
        {step !== 'name_age' && (
          <button onClick={() => step === 'photos' || step === 'bio' ? nextStep() : undefined}
            className="w-full text-center text-[#7070A0] text-sm py-2">
            {step === 'photos' || step === 'bio' ? 'Skip for now' : ''}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Location Permission ──────────────────────────────────────────────────────
export function LocationPermScreen() {
  const { navigate, resetNav, dispatch, showToast } = useApp();
  const [state, setState] = useState<'idle' | 'requesting' | 'denied'>('idle');

  function requestLocation() {
    setState('requesting');
    setTimeout(() => {
      dispatch({ type: 'SET_LOCATION', location: 'Central London' });
      showToast('Location set to Central London');
      resetNav('discover');
    }, 1500);
  }

  function chooseManually() {
    navigate('map');
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16] px-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
        <div className="w-24 h-24 rounded-full bg-[#FF3D6B]/10 flex items-center justify-center text-5xl">
          📍
        </div>
        <div>
          <h2 data-heading className="text-2xl font-extrabold text-[#F0F0FA] mb-3">Find people near you</h2>
          <p className="text-[#7070A0] leading-relaxed">
            Use your location to discover people nearby. Your exact location will never be displayed to other users.
          </p>
        </div>
        {state === 'denied' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
            Location access is unavailable. You can choose manually or open Settings to grant access.
          </div>
        )}
      </div>
      <div className="pb-12 space-y-3">
        {state === 'requesting' ? (
          <div className="flex items-center justify-center gap-3 py-5 text-[#7070A0]">
            <Spinner size={20} />
            <span>Detecting your location…</span>
          </div>
        ) : (
          <>
            <Button variant="primary" fullWidth size="lg" onClick={requestLocation}>
              📍  Use My Current Location
            </Button>
            <Button variant="outline" fullWidth size="lg" onClick={chooseManually}>
              Choose Location on Map
            </Button>
            {state === 'denied' && (
              <Button variant="ghost" fullWidth onClick={() => showToast('Open Settings to allow location access', 'info')}>
                Open Settings
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
