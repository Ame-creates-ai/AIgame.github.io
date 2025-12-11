import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// --- Types ---
type AppId = 'chat' | 'rps' | 'scavenger' | 'settings' | 'browser';
interface UserProfile { name: string; timezone: string; avatar: string; }
interface Message { id: number; sender: 'user' | 'ai'; text: string; time: string; }

// --- 1. System Components ---

// ONBOARDING: Saves profile to 'localStorage' so it remembers you
const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleStart = () => {
    if (!name.trim()) return;
    const profile = { name, timezone, avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}` };
    localStorage.setItem('userProfile', JSON.stringify(profile)); // Save to browser
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-purple-500 max-w-md w-full animate-in fade-in zoom-in">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">Initialize System</h1>
        <p className="text-gray-400 mb-6">Create your Virtual Identity.</p>
        <div className="space-y-4">
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded p-3 focus:border-purple-500 outline-none text-lg"
            placeholder="Enter Username..."
          />
          <button 
            onClick={handleStart}
            disabled={!name}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded font-bold transition shadow-lg"
          >
            BOOT SYSTEM_
          </button>
        </div>
      </div>
    </div>
  );
};

// WINDOW FRAME: Draggable-looking container
const WindowFrame = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
    <div className="bg-slate-800 w-full max-w-2xl h-[80vh] rounded-lg shadow-2xl border border-slate-600 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-700 p-3 flex justify-between items-center select-none border-b border-slate-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={onClose}></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <span className="ml-3 font-bold text-sm text-slate-200 tracking-wide">{title}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <div className="flex-1 overflow-hidden bg-slate-900/95 relative flex flex-col">
        {children}
      </div>
    </div>
  </div>
);

// --- 2. App Components ---

// CHAT APP: Simulates AI replies
const ChatApp = ({ user }: { user: UserProfile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: `Hey ${user.name}! It's Rebecca. I see you're connected from ${user.timezone.split('/')[1] || 'Earth'}. What's on your mind?`, time: new Date().toLocaleTimeString() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // 1. Add User Message
    const newMsg: Message = { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI "Thinking" and Replying
    setTimeout(() => {
      const replies = [
        "That's super interesting! Tell me more! 🤠",
        "Oh wow, really? I was just out riding my horse earlier.",
        "Haha, that reminds me of a dad joke... why did the scarecrow win an award? Because he was outstanding in his field!",
        "I'd love to see a picture of that!",
        "To be honest, I'm just a demo right now, but soon I'll have a real AI brain connected!"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const aiMsg: Message = { id: Date.now() + 1, sender: 'ai', text: randomReply, time: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-gray-200 rounded-bl-none'}`}>
              <p>{msg.text}</p>
              <p className="text-[10px] opacity-50 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-gray-500 text-sm ml-4 italic">Rebecca is typing...</div>}
        <div ref={scrollRef} />
      </div>
      <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          type="text" 
          placeholder="Message Rebecca..." 
          className="flex-1 bg-slate-900 rounded-full px-4 py-2 outline-none text-white border border-slate-600 focus:border-blue-500" 
        />
        <button onClick={handleSend} className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 w-10 h-10 flex items-center justify-center">➤</button>
      </div>
    </div>
  );
};

// GAME APP: Actually turns on the Webcam
const RPSGame = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    // Attempt to access webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();

    // Cleanup when window closes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg">
        {!cameraActive && (
           <div className="absolute inset-0 flex items-center justify-center text-gray-500">
             Loading Camera...
           </div>
        )}
        {/* The Real Video Feed */}
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
        
        {/* Game UI Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-purple-300 font-bold border border-purple-500/50">
          Player 1
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition">
          ✊ Rock
        </button>
        <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition">
          ✋ Paper
        </button>
        <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition">
          ✌️ Scissors
        </button>
      </div>
    </div>
  );
};

// --- 3. Main Desktop ---
function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [time, setTime] = useState(new Date());

  // Check for saved login on load
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) setUser(JSON.parse(saved));
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem('userProfile');
    setUser(null);
  };

  if (!user) return <Onboarding onComplete={setUser} />;

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col font-sans text-white bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')`, backgroundColor: '#2d1b4e' }}
    >
      {/* Desktop Space */}
      <div className="flex-1 relative">
        {/* Desktop Icons */}
        <div className="p-4 flex flex-col gap-4 items-start w-fit">
          <button onClick={() => setActiveApp('chat')} className="w-24 flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-105 transition border border-white/20">💬</div>
            <span className="text-xs font-medium bg-black/50 px-2 py-0.5 rounded shadow-sm">Messages</span>
          </button>
          
          <button onClick={() => setActiveApp('rps')} className="w-24 flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-105 transition border border-white/20">🎮</div>
            <span className="text-xs font-medium bg-black/50 px-2 py-0.5 rounded shadow-sm">Arcade</span>
          </button>

          <button onClick={logout} className="mt-auto w-24 flex flex-col items-center gap-1 group opacity-70 hover:opacity-100">
            <div className="w-14 h-14 bg-slate-700 rounded-xl shadow-lg flex items-center justify-center text-xl">🚪</div>
            <span className="text-xs font-medium bg-black/50 px-2 py-0.5 rounded shadow-sm">Log Out</span>
          </button>
        </div>

        {/* Windows */}
        {activeApp === 'chat' && (
          <WindowFrame title="Messages - Rebecca (Online)" onClose={() => setActiveApp(null)}>
            <ChatApp user={user} />
          </WindowFrame>
        )}
        {activeApp === 'rps' && (
          <WindowFrame title="Arcade - Camera Access Required" onClose={() => setActiveApp(null)}>
            <RPSGame />
          </WindowFrame>
        )}
      </div>

      {/* Taskbar */}
      <div className="h-10 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-3">
          <button className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-2 border border-white/10">
             ❖ START
          </button>
          {activeApp && (
            <div className="bg-slate-800 border-b-2 border-blue-400 px-4 py-1 text-xs rounded-t flex items-center gap-2">
              {activeApp === 'chat' ? '💬 Chat' : '🎮 Game'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
           <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
             <img src={user.avatar} className="w-5 h-5 rounded bg-slate-500" alt="avatar" />
             <span className="font-semibold text-gray-300">{user.name}</span>
           </div>
           <div className="font-mono text-gray-400">
             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;