import { ReactElement } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { ToastContainer } from './components/ui';

// Auth screens
import { SplashScreen, WelcomeScreen, OnboardingScreen, LocationPermScreen } from './screens/Auth';
// Discover
import { DiscoverScreen, SearchScreen } from './screens/Discover';
// Profile
import { ProfileViewScreen, PhotoViewerScreen } from './screens/Profile';
// Chats
import { ChatListScreen, ChatScreen } from './screens/Chats';
// Calls
import { AudioCallScreen, VideoCallScreen, IncomingCallScreen } from './screens/Call';
// My Profile / Settings
import {
  MyProfileScreen, EditProfileScreen, PrivacySettingsScreen,
  SafetyCenterScreen, BlockedUsersScreen, NotificationSettingsScreen,
  SecuritySettingsScreen, DiscoverySettingsScreen, LocationSettingsScreen,
} from './screens/MyProfile';
// Map
import { MapScreen } from './screens/MapView';

function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="flex items-center justify-between px-6 pt-1 pb-0.5 h-11 flex-shrink-0 bg-[#0A0A16]">
      <span className="text-white text-[13px] font-semibold tracking-tight">{time}</span>
      {/* Dynamic island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-8 bg-black rounded-full" />
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="8" width="3" height="4" rx="1" opacity="0.4"/>
          <rect x="4.5" y="5" width="3" height="7" rx="1" opacity="0.6"/>
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" opacity="0.8"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1"/>
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
          <path d="M3.5 6.5C5 5 6.4 4.2 8 4.2s3 .8 4.5 2.3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M1 4C3.2 1.8 5.5 0.8 8 0.8s4.8 1 7 3.2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 rounded-[3px] border border-white/60 relative flex items-center px-0.5">
            <div className="h-1.5 rounded-sm bg-white" style={{ width: '70%' }} />
          </div>
          <div className="w-0.5 h-1.5 bg-white/40 rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="flex justify-center pt-2 pb-2 bg-[#0A0A16] flex-shrink-0">
      <div className="w-32 h-1 bg-white/20 rounded-full" />
    </div>
  );
}

function AppShell() {
  const { currentScreen, state } = useApp();
  const noStatusBar = ['splash', 'welcome', 'photo_viewer', 'audio_call', 'video_call', 'incoming_call'];
  const noHomeBar = ['photo_viewer', 'audio_call', 'video_call', 'incoming_call'];

  const screenMap: Record<string, ReactElement> = {
    splash: <SplashScreen />,
    welcome: <WelcomeScreen />,
    onboarding: <OnboardingScreen />,
    location_perm: <LocationPermScreen />,
    discover: <DiscoverScreen />,
    search: <SearchScreen />,
    map: <MapScreen />,
    profile_view: <ProfileViewScreen />,
    photo_viewer: <PhotoViewerScreen />,
    chat_list: <ChatListScreen />,
    chat: <ChatScreen />,
    audio_call: <AudioCallScreen />,
    video_call: <VideoCallScreen />,
    incoming_call: <IncomingCallScreen />,
    my_profile: <MyProfileScreen />,
    edit_profile: <EditProfileScreen />,
    privacy_settings: <PrivacySettingsScreen />,
    safety_center: <SafetyCenterScreen />,
    blocked_users: <BlockedUsersScreen />,
    report_user: <ProfileViewScreen />,
    notification_settings: <NotificationSettingsScreen />,
    security_settings: <SecuritySettingsScreen />,
    discovery_settings: <DiscoverySettingsScreen />,
    location_settings: <LocationSettingsScreen />,
  };

  const screen = screenMap[currentScreen] ?? <SplashScreen />;
  const showStatus = !noStatusBar.includes(currentScreen);
  const showHome = !noHomeBar.includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a0a20 0%, #0a0a10 60%)' }}>
      {/* Phone shell */}
      <div
        className="relative flex flex-col bg-[#0A0A16] overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          border: '10px solid #1c1c1e',
          boxShadow: '0 0 0 1px #333, 0 40px 120px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Side button reflections */}
        <div className="absolute -right-[11px] top-28 w-[3px] h-16 bg-[#2a2a2a] rounded-r-full" />
        <div className="absolute -left-[11px] top-20 w-[3px] h-10 bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[11px] top-36 w-[3px] h-14 bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[11px] top-56 w-[3px] h-14 bg-[#2a2a2a] rounded-l-full" />

        {showStatus && <StatusBar />}

        <div className="flex-1 overflow-hidden relative">
          <div key={currentScreen} className="absolute inset-0 slide-in-right overflow-y-auto overscroll-contain">
            {screen}
          </div>
        </div>

        {showHome && <HomeIndicator />}
        <ToastContainer toasts={state.toasts} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
