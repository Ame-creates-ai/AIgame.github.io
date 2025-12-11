import React, { useState, useEffect } from 'react';
import './index.css';

// --- Types ---
type AppId = 'chat' | 'rps' | 'scavenger' | 'settings' | 'browser';

interface UserProfile {
  name: string;
  timezone: string;
  avatar: string; // URL or placeholder
}

// --- Components ---

// 1. The Onboarding Screen
const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const handleStart = () => {
    if (!name.trim()) return;
    // For MVP, we use a placeholder pixel avatar
    const defaultAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`; 
    onComplete({ name, timezone, avatar: defaultAvatar });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-purple-500 max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">Initialize System</h1>
        <p className="text-gray-400 mb-6">Welcome to Virtual Desktop AI. Please identify yourself.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1">Username</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 focus:border-purple-500 outline-none transition"
              placeholder="Enter your name..."
            />
          </div>
          
          <div>
            <label className="block text-sm text-purple-300 mb-1">Timezone</label>
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 outline-none"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (US)</option>
              <option value="America/Los_Angeles">Pacific Time (US)</option>
              <option value="Europe/London">London (UK)</option>
              <option value="Asia/Tokyo">Tokyo (JP)</option>
            </select>
          </div>

          <button 
            onClick={handleStart}
            disabled={!name}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-bold transition shadow-lg mt-4"
          >
            BOOT SYSTEM_
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. The Window Component (The frame for apps)
const WindowFrame = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div className="bg-slate-800 w-full max-w-2xl h-[600px] rounded-lg shadow-2xl border border-slate-600 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Title Bar */}
      <div className="bg-slate-700 p-2 flex justify-between items-center cursor-move select-none border-b border-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-2 font-bold text-sm text-slate-200">{title}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white px-2">✕</button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-900/90 relative">
        {children}
      </div>
    </div>
  </div>
);

// 3. Placeholder Apps
const ChatApp = ({ user }: { user: UserProfile }) => (
  <div className="p-4 h-full flex flex-col">
    <div className="flex-1 p-4 border border-slate-700 rounded mb-4 overflow-y-auto bg-slate-950/50">
      <div className="mb-4 flex gap-3">
        <div className="w-10 h-10 rounded bg-blue-500 flex items-center justify-center">R</div>
        <div>
          <span className="text-blue-400 text-xs font-bold">Rebecca (AI)</span>
          <div className="bg-slate-800 p-2 rounded-r-lg rounded-bl-lg mt-1 text-sm text-gray-200">
            Hey {user.name}! I noticed it's {new Date().toLocaleTimeString()} where you are. How's it going?
          </div>
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <input type="text" placeholder="Message Rebecca..." className="flex-1 bg-slate-800 rounded p-2 outline-none text-white border border-slate-600" />
      <button className="px-4 bg-blue-600 rounded text-white hover:bg-blue-500">Send</button>
    </div>
  </div>
);

const RPSGame = () => (
  <div className="p-8 h-full flex flex-col items-center justify-center text-center">
    <h2 className="text-2xl font-bold text-purple-400 mb-4">Rock Paper Scissors</h2>
    <div className="w-full max-w-md aspect-video bg-black rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center mb-6">
      <p className="text-gray-500 animate-pulse">[ Webcam Feed Placeholder ]</p>
    </div>
    <p className="text-sm text-gray-400 mb-4">Waiting for hand gesture...</p>
    <div className="flex gap-4">
      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">✊</div>
      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">jh</div>
      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">✌️</div>
    </div>
  </div>
);

// --- Main Desktop Application ---
function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // If not logged in, show Onboarding
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center flex flex-col justify-between font-sans text-white"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')`, // Vaporwave placeholder bg
        backgroundColor: '#2d1b4e' 
      }}
    >
      
      {/* Desktop Icons Area */}
      <div className="flex-1 p-6 grid grid-cols-1 gap-6 content-start justify-items-start w-32">
        <button onClick={() => setActiveApp('chat')} className="group flex flex-col items-center gap-2 w-24 hover:bg-white/10 p-2 rounded transition">
          <div className="w-12 h-12 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">💬</div>
          <span className="text-sm font-medium drop-shadow-md bg-black/50 px-2 rounded">Messages</span>
        </button>

        <button onClick={() => setActiveApp('rps')} className="group flex flex-col items-center gap-2 w-24 hover:bg-white/10 p-2 rounded transition">
          <div className="w-12 h-12 bg-purple-500 rounded-xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">✂️</div>
          <span className="text-sm font-medium drop-shadow-md bg-black/50 px-2 rounded">Games</span>
        </button>

        <button onClick={() => setActiveApp('browser')} className="group flex flex-col items-center gap-2 w-24 hover:bg-white/10 p-2 rounded transition">
          <div className="w-12 h-12 bg-orange-500 rounded-xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">🌐</div>
          <span className="text-sm font-medium drop-shadow-md bg-black/50 px-2 rounded">Web</span>
        </button>
      </div>

      {/* Taskbar */}
      <div className="h-12 bg-slate-900/90 backdrop-blur border-t border-slate-700 flex items-center px-4 justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded text-xs font-bold px-3 hover:bg-purple-500 cursor-pointer transition">
             START
          </div>
          {/* Active Windows in Taskbar */}
          {activeApp && (
             <div className="bg-slate-700 px-4 py-1 rounded text-sm border-b-2 border-blue-400 flex items-center gap-2">
                <span>{activeApp === 'chat' ? '💬 Messages' : activeApp === 'rps' ? '✂️ Games' : 'App'}</span>
             </div>
          )}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 text-sm bg-slate-800 px-3 py-1 rounded">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-gray-300">{user.name}</span>
          </div>
          <div className="text-gray-400">|</div>
          <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {/* Windows Manager */}
      {activeApp === 'chat' && (
        <WindowFrame title="Messages - Rebecca" onClose={() => setActiveApp(null)}>
          <ChatApp user={user} />
        </WindowFrame>
      )}

      {activeApp === 'rps' && (
        <WindowFrame title="Arcade - Rock Paper Scissors" onClose={() => setActiveApp(null)}>
          <RPSGame />
        </WindowFrame>
      )}

    </div>
  );
}

export default App;