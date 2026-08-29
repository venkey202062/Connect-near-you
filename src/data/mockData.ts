export type OnlineStatus = 'online' | 'active_5min' | 'active_1hr' | 'active_today' | 'offline';
export type Gender = 'woman' | 'man' | 'non-binary' | 'prefer_not';
export type MessageType = 'text' | 'image' | 'voice' | 'call_audio' | 'call_video';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type CallStatus = 'missed' | 'ended' | 'declined' | 'no_answer';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  photos: string[];
  distance: number;
  status: OnlineStatus;
  interests: string[];
  job?: string;
  education?: string;
  location: string;
  languages?: string[];
  joinedDaysAgo?: number;
}

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  voiceDuration?: number;
  callStatus?: CallStatus;
  callDuration?: string;
  timestamp: Date;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  unreadCount: number;
  isMuted: boolean;
}

export interface Filters {
  ageMin: number;
  ageMax: number;
  distance: number;
  availability: 'everyone' | 'online' | 'recent';
  photos: 'everyone' | 'with_photos' | 'without_photos';
  gender: Gender[];
  sort: 'distance' | 'active' | 'new' | 'relevance';
}

export interface CurrentUser {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: Gender;
  preferences: Gender[];
  bio: string;
  photos: string[];
  job: string;
  education: string;
  interests: string[];
  location: string;
  showOnlineStatus: boolean;
  showActivityStatus: boolean;
  showInDiscovery: boolean;
  allowMessages: boolean;
  notifyMessages: boolean;
  notifyCalls: boolean;
  notifyActivity: boolean;
  email: string;
  phone: string;
}

export const defaultCurrentUser: CurrentUser = {
  id: 'me',
  name: 'Jordan',
  age: 27,
  dob: '1997-03-15',
  gender: 'prefer_not',
  preferences: ['woman', 'man', 'non-binary'],
  bio: 'Explorer at heart. Coffee enthusiast, amateur photographer, and lover of live music. Looking to meet genuine people.',
  photos: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&auto=format'],
  job: 'Product Designer',
  education: 'University of Arts London',
  interests: ['Photography', 'Coffee', 'Music', 'Travel', 'Cinema'],
  location: 'Central London',
  showOnlineStatus: true,
  showActivityStatus: true,
  showInDiscovery: true,
  allowMessages: true,
  notifyMessages: true,
  notifyCalls: true,
  notifyActivity: true,
  email: 'jordan@example.com',
  phone: '+44 7700 123456',
};

export const sampleUsers: User[] = [
  {
    id: 'u1',
    name: 'Emma',
    age: 28,
    gender: 'woman',
    bio: "Art gallery curator with a soft spot for jazz bars and rainy afternoons. I can talk about books for hours. Looking for someone curious about the world.",
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1484688493527-670f98f9b195?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 2.4,
    status: 'online',
    interests: ['Coffee', 'Travel', 'Music', 'Art', 'Books'],
    job: 'Gallery Curator',
    education: 'Central Saint Martins',
    location: 'Shoreditch, London',
    languages: ['English', 'French'],
    joinedDaysAgo: 14,
  },
  {
    id: 'u2',
    name: 'Sophie',
    age: 31,
    gender: 'woman',
    bio: "Pediatric nurse who recharges by hiking and trying new restaurants. Honest, warm, and genuinely terrible at bowling — let's play sometime.",
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1526835746352-0b9da4054862?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 4.1,
    status: 'active_5min',
    interests: ['Hiking', 'Food', 'Wellness', 'Running', 'Cooking'],
    job: 'Pediatric Nurse',
    education: 'King\'s College London',
    location: 'Islington, London',
    languages: ['English'],
    joinedDaysAgo: 31,
  },
  {
    id: 'u3',
    name: 'Olivia',
    age: 26,
    gender: 'woman',
    bio: "Software engineer by day, ceramic artist by weekend. I like dogs, rooftop bars, and people who can hold a real conversation.",
    photos: [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 7.2,
    status: 'online',
    interests: ['Tech', 'Ceramics', 'Dogs', 'Rooftops', 'Wine'],
    job: 'Software Engineer',
    education: 'Imperial College London',
    location: 'Hackney, London',
    languages: ['English', 'Spanish'],
    joinedDaysAgo: 7,
  },
  {
    id: 'u4',
    name: 'Alex',
    age: 30,
    gender: 'non-binary',
    bio: "Freelance journalist. I write about culture and climate. Probably thinking about something you've never considered.",
    photos: [],
    distance: 5.6,
    status: 'active_1hr',
    interests: ['Journalism', 'Climate', 'Film', 'Cycling', 'Podcasts'],
    job: 'Journalist',
    education: 'City, University of London',
    location: 'Dalston, London',
    languages: ['English', 'German'],
    joinedDaysAgo: 45,
  },
  {
    id: 'u5',
    name: 'Daniel',
    age: 34,
    gender: 'man',
    bio: "Architect. I draw things all day and cook elaborate meals at night. I'm into long walks, terrible puns, and finding the best dim sum in the city.",
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 8.3,
    status: 'active_today',
    interests: ['Architecture', 'Cooking', 'Dim Sum', 'Walking', 'Puns'],
    job: 'Architect',
    education: 'Bartlett School of Architecture',
    location: 'Bermondsey, London',
    languages: ['English', 'Portuguese'],
    joinedDaysAgo: 60,
  },
  {
    id: 'u6',
    name: 'Maya',
    age: 29,
    gender: 'woman',
    bio: "Clinical psychologist and amateur stand-up comedian. I contain multitudes. Looking for someone who laughs at the same things I do.",
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 3.8,
    status: 'online',
    interests: ['Psychology', 'Comedy', 'Theatre', 'Yoga', 'Books'],
    job: 'Psychologist',
    education: 'UCL',
    location: 'Camden, London',
    languages: ['English', 'Hindi'],
    joinedDaysAgo: 21,
  },
  {
    id: 'u7',
    name: 'Liam',
    age: 32,
    gender: 'man',
    bio: "Chef at a Michelin-starred restaurant. Off duty I'm obsessive about football, reading biographies, and finding the perfect espresso.",
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 6.5,
    status: 'offline',
    interests: ['Cooking', 'Football', 'Biographies', 'Coffee', 'Film'],
    job: 'Head Chef',
    education: 'Le Cordon Bleu',
    location: 'Soho, London',
    languages: ['English', 'Italian'],
    joinedDaysAgo: 90,
  },
  {
    id: 'u8',
    name: 'Zoe',
    age: 25,
    gender: 'woman',
    bio: "Marine biologist finishing my PhD. I spend more time with fish than people — trying to fix that. Passionate about the ocean and terrible at sitting still.",
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&auto=format',
    ],
    distance: 11.4,
    status: 'active_5min',
    interests: ['Marine Biology', 'Diving', 'Surfing', 'Photography', 'Travel'],
    job: 'PhD Researcher',
    education: 'Natural History Museum / Imperial',
    location: 'Greenwich, London',
    languages: ['English', 'Welsh'],
    joinedDaysAgo: 5,
  },
];

const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60000);
const hrs = (n: number) => new Date(now.getTime() - n * 3600000);
const days = (n: number) => new Date(now.getTime() - n * 86400000);

export const sampleConversations: Conversation[] = [
  {
    id: 'c1',
    userId: 'u1',
    unreadCount: 2,
    isMuted: false,
    messages: [
      { id: 'm1', senderId: 'u1', type: 'text', text: 'Hey! I love your photography work on your profile 📸', timestamp: days(2), status: 'read' },
      { id: 'm2', senderId: 'me', type: 'text', text: "Thank you! I saw your gallery work — that Basquiat exhibition looked incredible!", timestamp: days(2), status: 'read' },
      { id: 'm3', senderId: 'u1', type: 'text', text: 'It really was. There\'s something about his rawness that gets me every time. Do you ever go to Tate Modern?', timestamp: days(1), status: 'read' },
      { id: 'm4', senderId: 'me', type: 'text', text: "All the time. I was there last Tuesday actually — the Sonia Delaunay retrospective is on now.", timestamp: days(1), status: 'read' },
      { id: 'm5', senderId: 'u1', type: 'text', text: "Oh I haven't seen that one! Would you want to go together sometime? 🎨", timestamp: mins(45), status: 'read' },
      { id: 'm6', senderId: 'u1', type: 'text', text: "Also I've been meaning to ask — where's your favourite coffee spot around Shoreditch?", timestamp: mins(12), status: 'delivered' },
    ],
  },
  {
    id: 'c2',
    userId: 'u2',
    unreadCount: 0,
    isMuted: false,
    messages: [
      { id: 'm1', senderId: 'me', type: 'text', text: "Hi Sophie! Your hiking photos look amazing — which trail is that?", timestamp: days(5), status: 'read' },
      { id: 'm2', senderId: 'u2', type: 'text', text: "That's Snowdon! Did it last summer — absolutely worth every blister 😅", timestamp: days(5), status: 'read' },
      { id: 'm3', senderId: 'u2', type: 'text', text: "Have you ever hiked in Wales?", timestamp: days(5), status: 'read' },
      { id: 'm4', senderId: 'me', type: 'text', text: "Not yet but it's on my list. Maybe we could plan something!", timestamp: days(4), status: 'read' },
      { id: 'm5', senderId: 'u2', type: 'call_audio', callStatus: 'ended', callDuration: '14:32', timestamp: days(3), status: 'read' },
      { id: 'm6', senderId: 'u2', type: 'text', text: "Great chat! Let me know about that restaurant you mentioned 🍜", timestamp: days(3), status: 'read' },
    ],
  },
  {
    id: 'c3',
    userId: 'u3',
    unreadCount: 1,
    isMuted: false,
    messages: [
      { id: 'm1', senderId: 'u3', type: 'text', text: 'Ceramic artist here trying to make a connection 😄', timestamp: hrs(3), status: 'read' },
      { id: 'm2', senderId: 'me', type: 'text', text: "Ha! Love the intro. What kind of ceramics do you make?", timestamp: hrs(2), status: 'read' },
      { id: 'm3', senderId: 'u3', type: 'text', text: "Mostly functional stuff — bowls, mugs, planters. But I've been experimenting with sculptural pieces lately", timestamp: hrs(2), status: 'read' },
      { id: 'm4', senderId: 'u3', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=300&fit=crop&auto=format', timestamp: hrs(1), status: 'delivered' },
    ],
  },
  {
    id: 'c5',
    userId: 'u5',
    unreadCount: 0,
    isMuted: true,
    messages: [
      { id: 'm1', senderId: 'u5', type: 'text', text: "Dim sum lover here. Heard you know the city well?", timestamp: days(7), status: 'read' },
      { id: 'm2', senderId: 'me', type: 'text', text: "Ha, I try! Have you been to Royal China in Baker Street?", timestamp: days(7), status: 'read' },
      { id: 'm3', senderId: 'u5', type: 'call_video', callStatus: 'missed', timestamp: days(6), status: 'read' },
      { id: 'm4', senderId: 'u5', type: 'text', text: "Sorry missed your call! Free this weekend?", timestamp: days(6), status: 'read' },
    ],
  },
];

export const defaultFilters: Filters = {
  ageMin: 18,
  ageMax: 45,
  distance: 50,
  availability: 'everyone',
  photos: 'everyone',
  gender: ['woman', 'man', 'non-binary'],
  sort: 'distance',
};

export function getStatusLabel(status: OnlineStatus): string {
  switch (status) {
    case 'online': return 'Online';
    case 'active_5min': return 'Active 5 min ago';
    case 'active_1hr': return 'Active 1 hr ago';
    case 'active_today': return 'Active today';
    case 'offline': return 'Offline';
  }
}

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
