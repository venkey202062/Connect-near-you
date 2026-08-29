import { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { Avatar, NavBar, EmptyState, SkeletonRow, Modal, BottomSheet } from '../components/ui';
import { formatTime, Message, User } from '../data/mockData';

// ─── ChatListScreen ───────────────────────────────────────────────────────────
export function ChatListScreen() {
  const { state, navigate, dispatch } = useApp();
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [deleteConvId, setDeleteConvId] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const totalUnread = state.conversations.reduce((s, c) => s + c.unreadCount, 0);

  const convs = useMemo(() => {
    return state.conversations
      .filter(c => !state.blockedIds.includes(c.userId))
      .map(c => {
        const user = state.users.find(u => u.id === c.userId);
        const lastMsg = c.messages[c.messages.length - 1];
        return { conv: c, user, lastMsg };
      })
      .filter(x => x.user)
      .sort((a, b) => {
        const at = a.lastMsg?.timestamp?.getTime() ?? 0;
        const bt = b.lastMsg?.timestamp?.getTime() ?? 0;
        return bt - at;
      });
  }, [state.conversations, state.users, state.blockedIds]);

  function lastMsgPreview(msg?: Message): string {
    if (!msg) return 'Start a conversation';
    if (msg.type === 'text') return msg.text || '';
    if (msg.type === 'image') return '📷 Photo';
    if (msg.type === 'voice') return '🎤 Voice message';
    if (msg.type === 'call_audio') return msg.callStatus === 'missed' ? '📵 Missed call' : '📞 Audio call';
    if (msg.type === 'call_video') return msg.callStatus === 'missed' ? '📵 Missed video call' : '📹 Video call';
    return '';
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <h1 data-heading className="text-2xl font-extrabold text-[#F0F0FA]">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-[#FF3D6B] text-white text-xs font-bold px-2.5 py-1 rounded-full">{totalUnread}</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div>{[1,2,3].map(i => <SkeletonRow key={i} />)}</div>
        ) : convs.length === 0 ? (
          <EmptyState icon="💬" title="No conversations yet" body="Your conversations will appear here." />
        ) : (
          <div>
            {convs.map(({ conv, user, lastMsg }) => {
              if (!user) return null;
              const isMissedCall = lastMsg?.type?.includes('call') && lastMsg?.callStatus === 'missed';
              return (
                <div key={conv.id} className="relative overflow-hidden">
                  {/* Swipe actions */}
                  {swipedId === conv.id && (
                    <div className="absolute right-0 top-0 bottom-0 flex">
                      <button onClick={() => { dispatch({ type: 'MUTE_CONVERSATION', conversationId: conv.id }); setSwipedId(null); }}
                        className="bg-[#3D3D5C] text-white px-4 text-xs font-semibold flex flex-col items-center justify-center gap-1">
                        {conv.isMuted ? '🔔' : '🔕'}
                        <span>{conv.isMuted ? 'Unmute' : 'Mute'}</span>
                      </button>
                      <button onClick={() => { setDeleteConvId(conv.id); setSwipedId(null); }}
                        className="bg-[#FF4040] text-white px-4 text-xs font-semibold flex flex-col items-center justify-center gap-1">
                        🗑 <span>Delete</span>
                      </button>
                    </div>
                  )}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 border-b border-white/5 active:bg-white/3 text-left"
                    onClick={() => navigate('chat', { userId: user.id, conversationId: conv.id })}
                    onContextMenu={e => { e.preventDefault(); setSwipedId(swipedId === conv.id ? null : conv.id); }}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar user={user} size="lg" showStatus status={user.status} />
                      {conv.isMuted && (
                        <span className="absolute -bottom-0.5 -right-0.5 text-xs bg-[#1E1E32] rounded-full w-4 h-4 flex items-center justify-center">🔕</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[#F0F0FA]">{user.name}</span>
                        <span className={`text-xs ${conv.unreadCount > 0 && !conv.isMuted ? 'text-[#FF3D6B]' : 'text-[#7070A0]'}`}>
                          {lastMsg ? formatTime(lastMsg.timestamp) : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate flex-1 ${isMissedCall ? 'text-[#FF4040]' : conv.unreadCount > 0 ? 'text-[#F0F0FA]' : 'text-[#7070A0]'}`}>
                          {lastMsgPreview(lastMsg)}
                        </p>
                        {conv.unreadCount > 0 && !conv.isMuted && (
                          <span className="ml-2 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[#FF3D6B] text-white text-[10px] font-bold px-1.5 flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NavBar active="chat_list" onNavigate={s => navigate(s)} unreadCount={totalUnread} />

      {deleteConvId && (
        <Modal
          title="Delete conversation?"
          body="This will remove the conversation from your list. You can still message this person again."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          danger
          onConfirm={() => { dispatch({ type: 'DELETE_CONVERSATION', conversationId: deleteConvId }); setDeleteConvId(null); }}
          onCancel={() => setDeleteConvId(null)}
        />
      )}
    </div>
  );
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────
const EMOJI_LIST = ['😀','😂','🥰','😍','🤩','😎','🥹','😊','🫶','❤️','🔥','✨','💯','🎉','👍','😅','🤔','😢','😭','😮','🙈','💬','🎵','☕','🍕','🌹','🌊','🏔','✈️','🎨'];

export function ChatScreen() {
  const { state, navigate, goBack, dispatch, showToast, params } = useApp();
  const userId = params.userId as string;
  const convId = params.conversationId as string;

  const user = state.users.find(u => u.id === userId);
  const conv = state.conversations.find(c => c.userId === userId) || state.conversations.find(c => c.id === convId);

  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [longPressMsg, setLongPressMsg] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (conv) dispatch({ type: 'MARK_READ', conversationId: conv.id });
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length]);

  // Simulate other person typing then responding
  useEffect(() => {
    if (!conv || !user) return;
    const lastMsg = conv.messages[conv.messages.length - 1];
    if (lastMsg?.senderId === 'me' && lastMsg.type === 'text') {
      const t1 = setTimeout(() => setIsTyping(true), 1200);
      const t2 = setTimeout(() => {
        setIsTyping(false);
        const replies = [
          "That's so interesting! Tell me more 😊",
          "I totally agree with you on that!",
          "Haha yes exactly! When are you free?",
          "I was just thinking the same thing ✨",
          "That sounds amazing, I'd love that!",
        ];
        const reply: Message = {
          id: `m_${Date.now()}`,
          senderId: user.id,
          type: 'text',
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date(),
          status: 'delivered',
        };
        if (conv) dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: reply });
      }, 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [conv?.messages.length]);

  function sendText(t: string) {
    if (!t.trim() || !conv) return;
    const msg: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      type: 'text',
      text: t.trim(),
      timestamp: new Date(),
      status: 'sending',
    };
    dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: msg });
    setText('');
    setShowEmoji(false);
    setTimeout(() => {}, 800); // sent tick happens via re-render
  }

  function sendImage() {
    if (!conv) return;
    const msg: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=300&h=300&fit=crop&auto=format',
      timestamp: new Date(),
      status: 'sent',
    };
    dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: msg });
    setShowAttach(false);
    showToast('Photo sent');
  }

  function sendVoice() {
    if (!conv) return;
    const msg: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      type: 'voice',
      voiceDuration: 12,
      timestamp: new Date(),
      status: 'sent',
    };
    dispatch({ type: 'SEND_MESSAGE', conversationId: conv.id, message: msg });
    setShowAttach(false);
    showToast('Voice message sent');
  }

  if (!user || !conv) {
    return (
      <div className="flex flex-col h-full bg-[#0A0A16] items-center justify-center">
        <p className="text-[#7070A0]">Conversation not found.</p>
      </div>
    );
  }

  const messages = conv.messages;

  const statusIcon = (s: Message['status']) => {
    if (s === 'sending') return '○';
    if (s === 'sent') return '✓';
    if (s === 'delivered') return '✓✓';
    if (s === 'read') return <span className="text-[#FF3D6B]">✓✓</span>;
    if (s === 'failed') return <span className="text-red-400">!</span>;
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A16]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-3 bg-[#0A0A16] border-b border-white/5">
        <button onClick={goBack} className="text-[#F0F0FA] text-2xl w-9 h-9 flex items-center justify-center">←</button>
        <button onClick={() => navigate('profile_view', { userId: user.id })} className="flex items-center gap-3 flex-1">
          <Avatar user={user} size="md" showStatus status={user.status} />
          <div>
            <div className="font-bold text-[#F0F0FA] text-base leading-tight">{user.name}</div>
            <div className="text-xs text-[#7070A0]">
              {user.status === 'online' ? 'Online' : user.status === 'active_5min' ? 'Active 5 min ago' : 'Offline'}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('audio_call', { userId: user.id })}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8]">
            📞
          </button>
          <button onClick={() => navigate('video_call', { userId: user.id })}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8]">
            📹
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === 'me';
          const prevMsg = messages[idx - 1];
          const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
          const showAvatar = !isMe && (!messages[idx + 1] || messages[idx + 1].senderId !== msg.senderId);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <span className="bg-[#1E1E32] text-[#7070A0] text-xs px-3 py-1 rounded-full">
                    {new Date(msg.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
              <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} mb-0.5`}
                onContextMenu={e => { e.preventDefault(); setLongPressMsg(msg.id); }}>
                {!isMe && showAvatar && <Avatar user={user} size="xs" />}
                {!isMe && !showAvatar && <div className="w-7 flex-shrink-0" />}

                {/* Message bubble */}
                {msg.type === 'text' && (
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${isMe ? 'rounded-br-sm bg-[#FF3D6B] text-white' : 'rounded-bl-sm bg-[#141424] text-[#F0F0FA]'}`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] opacity-60">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <span className="text-[10px] opacity-70">{statusIcon(msg.status)}</span>}
                    </div>
                  </div>
                )}

                {msg.type === 'image' && (
                  <div className="max-w-[60%]">
                    <button onClick={() => navigate('photo_viewer', { userId: user.id, photoIndex: 0 })}
                      className="rounded-2xl overflow-hidden block">
                      <img src={msg.imageUrl} alt="Photo" className="w-full h-48 object-cover" />
                    </button>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-[#7070A0]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                )}

                {msg.type === 'voice' && (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${isMe ? 'bg-[#FF3D6B]' : 'bg-[#141424]'} max-w-[70%]`}>
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-[#FF3D6B]/20'}`}>
                      <span className={isMe ? 'text-white' : 'text-[#FF3D6B]'}>▶</span>
                    </button>
                    <div className="flex items-center gap-0.5 flex-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={`rounded-full ${isMe ? 'bg-white/60' : 'bg-[#FF3D6B]/60'}`}
                          style={{ width: 2, height: `${4 + Math.random() * 14}px`, animationDelay: `${i * 0.05}s` }} />
                      ))}
                    </div>
                    <span className={`text-xs ${isMe ? 'text-white/80' : 'text-[#7070A0]'}`}>{msg.voiceDuration}s</span>
                  </div>
                )}

                {(msg.type === 'call_audio' || msg.type === 'call_video') && (
                  <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${msg.callStatus === 'missed' ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#141424]'}`}>
                    <span className="text-xl">{msg.type === 'call_audio' ? '📞' : '📹'}</span>
                    <div>
                      <p className={`text-sm font-medium ${msg.callStatus === 'missed' ? 'text-red-400' : 'text-[#F0F0FA]'}`}>
                        {msg.callStatus === 'missed' ? `Missed ${msg.type === 'call_audio' ? 'call' : 'video call'}` :
                          msg.callStatus === 'ended' ? `${msg.type === 'call_audio' ? 'Call' : 'Video call'} ended` :
                          'Call declined'}
                      </p>
                      {msg.callDuration && <p className="text-xs text-[#7070A0]">{msg.callDuration}</p>}
                      <p className="text-xs text-[#7070A0]">{formatTime(msg.timestamp)}</p>
                    </div>
                    <button onClick={() => navigate(msg.type === 'call_audio' ? 'audio_call' : 'video_call', { userId: user.id })}
                      className="ml-auto text-[#FF3D6B] text-sm font-medium">Call back</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar user={user} size="xs" />
            <div className="bg-[#141424] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="bg-[#0E0E1C] border-t border-white/5 px-3 py-3">
          <div className="flex flex-wrap gap-2">
            {EMOJI_LIST.map(e => (
              <button key={e} onClick={() => { setText(t => t + e); inputRef.current?.focus(); }}
                className="text-2xl active:scale-110 transition-transform">{e}</button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="px-3 py-2 bg-[#0A0A16] border-t border-white/5">
        <div className="flex items-end gap-2">
          <button onClick={() => { setShowAttach(true); setShowEmoji(false); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8] flex-shrink-0 mb-0.5">
            +
          </button>
          <div className="flex-1 bg-[#141424] rounded-3xl border border-white/10 flex items-end gap-2 px-4 py-2 min-h-[44px]">
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(text); } }}
              placeholder="Write a message…"
              className="flex-1 bg-transparent text-[#F0F0FA] placeholder-[#4A4A6A] outline-none text-[15px] min-h-[24px]"
            />
            <button onClick={() => { setShowEmoji(v => !v); setShowAttach(false); }}
              className="text-[#7070A0] text-xl pb-0.5">😊</button>
          </div>
          {text.trim() ? (
            <button onClick={() => sendText(text)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF3D6B] text-white flex-shrink-0 mb-0.5 active:scale-95 transition-transform">
              ↑
            </button>
          ) : (
            <button onClick={sendVoice}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141424] text-[#B8B8D8] flex-shrink-0 mb-0.5">
              🎤
            </button>
          )}
        </div>
      </div>

      {/* Attachments */}
      {showAttach && (
        <BottomSheet onClose={() => setShowAttach(false)}>
          <div className="grid grid-cols-4 gap-4 px-5 py-6">
            {[
              { icon: '📷', label: 'Camera', action: sendImage },
              { icon: '🖼', label: 'Photos', action: sendImage },
              { icon: '🎤', label: 'Voice', action: sendVoice },
              { icon: '📍', label: 'Location', action: () => { showToast('Share your approximate location?', 'info'); setShowAttach(false); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-[#1E1E32] flex items-center justify-center text-2xl">{item.icon}</div>
                <span className="text-[#B8B8D8] text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Long press menu */}
      {longPressMsg && (
        <BottomSheet onClose={() => setLongPressMsg(null)}>
          <div className="py-2 pb-8">
            {[
              { icon: '📋', label: 'Copy', action: () => { showToast('Copied'); setLongPressMsg(null); } },
              { icon: '↩', label: 'Reply', action: () => setLongPressMsg(null) },
              { icon: '🗑', label: 'Delete', danger: true, action: () => { setDeleteMsg(longPressMsg); setLongPressMsg(null); } },
              { icon: '⚑', label: 'Report', action: () => { showToast('Message reported'); setLongPressMsg(null); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-4 ${(item as any).danger ? 'text-[#FF4040]' : 'text-[#F0F0FA]'} active:bg-white/5`}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {deleteMsg && (
        <Modal
          title="Delete message?"
          body="This message will be removed from your view."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          danger
          onConfirm={() => { showToast('Message deleted'); setDeleteMsg(null); }}
          onCancel={() => setDeleteMsg(null)}
        />
      )}
    </div>
  );
}
