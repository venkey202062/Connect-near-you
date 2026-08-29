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

function AppShell() {
  const { currentScreen, state } = useApp();

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

  return (
    <div className="flex items-stretch justify-center min-h-screen bg-black">
      {/* Mobile frame */}
      <div className="relative w-full max-w-[390px] h-screen overflow-hidden bg-[#0A0A16] flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <div key={currentScreen} className="absolute inset-0 slide-in-right overflow-y-auto">
            {screen}
          </div>
        </div>
        <ToastContainer toasts={state.toasts} />
      </div>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col justify-center pl-16 max-w-sm text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3D6B] to-[#FF7A3D] flex items-center justify-center">
            <span className="text-white text-2xl">♡</span>
          </div>
          <span className="text-white font-extrabold text-2xl" style={{ fontFamily: 'Plus Jakarta Sans' }}>Nearme</span>
        </div>
        <h2 className="text-3xl font-bold text-white leading-tight mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Meet people<br />around you.
        </h2>
        <p className="text-[#7070A0] leading-relaxed">
          Discover nearby people, chat instantly, and connect based on where you are.
        </p>
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
