import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import {
  CurrentUser, User, Conversation, Filters, Message,
  defaultCurrentUser, sampleUsers, sampleConversations, defaultFilters,
} from '../data/mockData';

export type Screen =
  | 'splash' | 'welcome' | 'onboarding' | 'location_perm'
  | 'discover' | 'search' | 'map'
  | 'profile_view' | 'photo_viewer'
  | 'chat_list' | 'chat'
  | 'audio_call' | 'video_call' | 'incoming_call'
  | 'my_profile' | 'edit_profile' | 'privacy_settings'
  | 'safety_center' | 'blocked_users' | 'report_user'
  | 'notification_settings' | 'security_settings'
  | 'discovery_settings' | 'location_settings';

export interface ToastMsg { id: string; text: string; type: 'success' | 'error' | 'info'; }

interface NavEntry { screen: Screen; params?: Record<string, unknown>; }

interface AppState {
  navStack: NavEntry[];
  currentUser: CurrentUser;
  users: User[];
  conversations: Conversation[];
  filters: Filters;
  blockedIds: string[];
  location: string;
  toasts: ToastMsg[];
  isOnboarded: boolean;
  isLoggedIn: boolean;
  params: Record<string, unknown>;
  savedPhotos: string[];
  theme: 'dark' | 'light';
}

type Action =
  | { type: 'NAVIGATE'; screen: Screen; params?: Record<string, unknown> }
  | { type: 'GO_BACK' }
  | { type: 'RESET_NAV'; screen: Screen }
  | { type: 'SET_FILTERS'; filters: Filters }
  | { type: 'BLOCK_USER'; userId: string }
  | { type: 'UNBLOCK_USER'; userId: string }
  | { type: 'SEND_MESSAGE'; conversationId: string; message: Message }
  | { type: 'CREATE_CONVERSATION'; userId: string }
  | { type: 'MARK_READ'; conversationId: string }
  | { type: 'DELETE_CONVERSATION'; conversationId: string }
  | { type: 'MUTE_CONVERSATION'; conversationId: string }
  | { type: 'ADD_TOAST'; toast: ToastMsg }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'UPDATE_CURRENT_USER'; user: Partial<CurrentUser> }
  | { type: 'SET_LOCATION'; location: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOGOUT' }
  | { type: 'DELETE_ACCOUNT' }
  | { type: 'SAVE_PHOTO'; url: string }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  navStack: [{ screen: 'splash' }],
  currentUser: defaultCurrentUser,
  users: sampleUsers,
  conversations: sampleConversations,
  filters: defaultFilters,
  blockedIds: [],
  location: 'Central London',
  toasts: [],
  isOnboarded: false,
  isLoggedIn: false,
  params: {},
  savedPhotos: [],
  theme: 'dark',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        navStack: [...state.navStack, { screen: action.screen, params: action.params }],
        params: action.params || {},
      };
    case 'GO_BACK': {
      if (state.navStack.length <= 1) return state;
      const newStack = state.navStack.slice(0, -1);
      return { ...state, navStack: newStack, params: newStack[newStack.length - 1].params || {} };
    }
    case 'RESET_NAV':
      return { ...state, navStack: [{ screen: action.screen }], params: {} };
    case 'SET_FILTERS':
      return { ...state, filters: action.filters };
    case 'BLOCK_USER':
      return {
        ...state,
        blockedIds: [...state.blockedIds, action.userId],
        conversations: state.conversations.filter(c => c.userId !== action.userId),
      };
    case 'UNBLOCK_USER':
      return { ...state, blockedIds: state.blockedIds.filter(id => id !== action.userId) };
    case 'SEND_MESSAGE': {
      const exists = state.conversations.find(c => c.id === action.conversationId);
      if (exists) {
        return {
          ...state,
          conversations: state.conversations.map(c =>
            c.id === action.conversationId
              ? { ...c, messages: [...c.messages, action.message] }
              : c
          ),
        };
      }
      return state;
    }
    case 'CREATE_CONVERSATION': {
      const existing = state.conversations.find(c => c.userId === action.userId);
      if (existing) return state;
      const newConv: Conversation = {
        id: `c_${action.userId}_${Date.now()}`,
        userId: action.userId,
        messages: [],
        unreadCount: 0,
        isMuted: false,
      };
      return { ...state, conversations: [newConv, ...state.conversations] };
    }
    case 'MARK_READ':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.conversationId
            ? {
                ...c,
                unreadCount: 0,
                messages: c.messages.map(m =>
                  m.senderId !== 'me' && m.status !== 'read' ? { ...m, status: 'read' as const } : m
                ),
              }
            : c
        ),
      };
    case 'DELETE_CONVERSATION':
      return { ...state, conversations: state.conversations.filter(c => c.id !== action.conversationId) };
    case 'MUTE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.conversationId ? { ...c, isMuted: !c.isMuted } : c
        ),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'UPDATE_CURRENT_USER':
      return { ...state, currentUser: { ...state.currentUser, ...action.user } };
    case 'SET_LOCATION':
      return { ...state, location: action.location };
    case 'COMPLETE_ONBOARDING':
      return { ...state, isOnboarded: true, isLoggedIn: true };
    case 'LOGOUT':
      return { ...initialState, navStack: [{ screen: 'welcome' }], isOnboarded: false, isLoggedIn: false };
    case 'DELETE_ACCOUNT':
      return { ...initialState, navStack: [{ screen: 'welcome' }] };
    case 'SAVE_PHOTO':
      if (state.savedPhotos.includes(action.url)) return state;
      return { ...state, savedPhotos: [action.url, ...state.savedPhotos] };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  currentScreen: Screen;
  params: Record<string, unknown>;
  navigate: (screen: Screen, params?: Record<string, unknown>) => void;
  goBack: () => void;
  resetNav: (screen: Screen) => void;
  dispatch: React.Dispatch<Action>;
  showToast: (text: string, type?: ToastMsg['type']) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.style.colorScheme = state.theme;
  }, [state.theme]);

  const currentEntry = state.navStack[state.navStack.length - 1];
  const currentScreen = currentEntry.screen;
  const params = currentEntry.params || {};

  const navigate = (screen: Screen, p?: Record<string, unknown>) =>
    dispatch({ type: 'NAVIGATE', screen, params: p });

  const goBack = () => dispatch({ type: 'GO_BACK' });
  const resetNav = (screen: Screen) => dispatch({ type: 'RESET_NAV', screen });

  const showToast = (text: string, type: ToastMsg['type'] = 'success') => {
    const id = `toast_${Date.now()}`;
    dispatch({ type: 'ADD_TOAST', toast: { id, text, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3000);
  };

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <AppContext.Provider value={{ state, currentScreen, params, navigate, goBack, resetNav, dispatch, showToast, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
