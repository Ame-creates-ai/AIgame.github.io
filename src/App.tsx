import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Gamepad2, User, X, Minus, Maximize2, Camera, Send, Edit3, Trash2 } from 'lucide-react';

const App = () => {
  // --- STATE MANAGEMENT ---
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [userName, setUserName] = useState('');
  const [userTimezone, setUserTimezone] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  // Window Management
  const [openWindows, setOpenWindows] = useState<any[]>([]);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  
  // Hardware Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Chat State
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Game States
  const [rpsGameActive, setRpsGameActive] = useState(false);
  const [rpsResult, setRpsResult] = useState<any>(null);
  const [rpsScore, setRpsScore] = useState({ user: 0, ai: 0 });

  const [doodleGameActive, setDoodleGameActive] = useState(false);
  const [doodleTarget, setDoodleTarget] = useState('');
  const [doodleGuess, setDoodleGuess] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const doodleCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);
  }, []);

  // --- CAMERA LOGIC (Pixel Avatar) ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert('Camera access denied. Please allow camera access in your browser settings.');
    }
  };

  const captureAndPixelate = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw small to create pixelation effect
    canvas.width = 64;
    canvas.height = 64;
    ctx.drawImage(video, 0, 0, 64, 64);
    
    // Convert to image URL
    setUserAvatar(canvas.toDataURL());
    
    // Stop camera
    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setCurrentScreen('desktop');
  };

  // --- WINDOW SYSTEM ---
  const openApp = (appType: string) => {
    const newWindow = {
      id: Date.now(),
      type: appType,
      title: appType === 'messages' ? 'Messages' : appType === 'games' ? 'Mini Games' : 'Profile',
      position: { x: 50 + openWindows.length * 30, y: 50 + openWindows.length * 30 }
    };
    setOpenWindows([...openWindows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const closeWindow = (id: number) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
  };

  // --- REAL AI CHAT LOGIC ---
  const sendMessage = async (characterId: string) => {
    if (!currentMessage.trim()) return;

    // 1. Update UI immediately with user message
    const userMsg = { role: 'user', content: currentMessage };
    const chatHistory = messages[characterId] || [];
    setMessages({ ...messages, [characterId]: [...chatHistory, userMsg] });
    
    const messageToSend = currentMessage; // Store for API call
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // 2. Check if API Key exists
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error("Missing API Key");
      }

      // 3. Call Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'dangerously-allow-browser': 'true' // Required for client-side testing
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          system: "You are Rebecca, a friendly 24-year-old girl who loves the countryside and dad jokes. Keep replies short and casual.",
          messages: [...chatHistory.map((m: any) => ({ role: m.role, content: m.content })), userMsg]
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      // 4. Update UI with AI response
      if (data.content && data.content[0]) {
        const reply = data.content[0].text;
        setMessages((prev: any) => ({
          ...prev,
          [characterId]: [...prev[characterId], { role: 'assistant', content: reply }]
        }));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      // Fallback response if API fails
      setMessages((prev: any) => ({
        ...prev,
        [characterId]: [...prev[characterId], { 
          role: 'assistant', 
          content: "I'm having trouble connecting! (Did you set VITE_ANTHROPIC_API_KEY in your .env file?)" 
        }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // --- MINI GAMES LOGIC ---
  
  // Rock Paper Scissors
  const startRPSGame = () => {
    setRpsGameActive(true);
    setRpsResult(null);
  };

  const playRPS = (userChoice: string) => {
    const choices = ['rock', 'paper', 'scissors'];
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    let result = 'tie';
    if (
      (userChoice === 'rock' && aiChoice === 'scissors') ||
      (userChoice === 'paper' && aiChoice === 'rock') ||
      (userChoice === 'scissors' && aiChoice === 'paper')
    ) result = 'win';
    else if (userChoice !== aiChoice) result = 'lose';

    if (result === 'win') setRpsScore(p => ({ ...p, user: p.user + 1 }));
    if (result === 'lose') setRpsScore(p => ({ ...p, ai: p.ai + 1 }));
    setRpsResult({ user: userChoice, ai: aiChoice, result });
  };

  // Doodle Dash
  const startDoodleGame = () => {
    setDoodleGameActive(true);
    const words = ['Sun', 'Tree', 'House', 'Smile', 'Apple'];
    setDoodleTarget(words[Math.floor(Math.random() * words.length)]);
    setDoodleGuess('');
    const canvas = doodleCanvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = doodleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // --- RENDER ---
  if (currentScreen === 'onboarding') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-900">Welcome! 👋</h1>
          
          {!userName ? (
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.value && setUserName(e.currentTarget.value)}
            />
          ) : !userAvatar ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600">Hi {userName}! Let's create your pixel avatar.</p>
              {!cameraActive ? (
                <button onClick={startCamera} className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700">
                  <Camera size={20} /> Start Camera
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  </div>
                  <button onClick={captureAndPixelate} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Capture & Pixelate</button>
                </div>
              )}
              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#2d1b4e] relative overflow-hidden font-sans select-none">
      {/* Background */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80')] bg-cover bg-center" />

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-12 bg-slate-900/95 border-t border-slate-700 flex items-center px-4 z-50 justify-between text-white shadow-lg">
        <div className="flex gap-2">
          <button className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded font-bold text-sm mr-2 transition">START</button>
          <button onClick={() => openApp('messages')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded transition border border-transparent hover:border-white/10"><MessageCircle size={18} /> Chat</button>
          <button onClick={() => openApp('games')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded transition border border-transparent hover:border-white/10"><Gamepad2 size={18} /> Games</button>
          <button onClick={() => openApp('profile')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded transition border border-transparent hover:border-white/10"><User size={18} /> Profile</button>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono opacity-80 bg-black/20 px-3 py-1 rounded">
          <span>{userName}</span>
          <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      {/* Windows Layer */}
      {openWindows.map((window) => (
        <div
          key={window.id}
          className="absolute bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-600"
          style={{ 
            left: window.position.x, top: window.position.y, 
            width: '700px', height: '500px',
            zIndex: activeWindow === window.id ? 50 : 10 
          }}
          onMouseDown={() => setActiveWindow(window.id)}
        >
          {/* Title Bar */}
          <div className="bg-slate-800 text-white p-3 flex justify-between items-center cursor-move select-none">
            <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={() => closeWindow(window.id)}></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="font-bold text-sm">{window.title}</span>
            </div>
            <button onClick={() => closeWindow(window.id)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>

          {/* Window Content */}
          <div className="flex-1 overflow-auto bg-slate-50 p-4">
            
            {/* --- MESSAGES APP --- */}
            {window.type === 'messages' && (
              <div className="flex h-full border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="w-1/3 bg-gray-50 border-r p-2 space-y-2">
                   <div onClick={() => setSelectedCharacter('rebecca')} className={`p-3 border rounded cursor-pointer transition ${selectedCharacter === 'rebecca' ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-100 border-gray-200'}`}>
                      <div className="font-bold text-slate-800 flex items-center gap-2">👩‍🌾 Rebecca</div>
                      <div className="text-xs text-green-600 pl-7">● Online</div>
                   </div>
                </div>
                <div className="w-2/3 flex flex-col bg-white">
                   {selectedCharacter ? (
                     <>
                       <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                          {(messages['rebecca'] || []).map((m: any, i: number) => (
                             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 px-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}`}>
                                   {m.content}
                                </div>
                             </div>
                          ))}
                          {isTyping && <div className="text-gray-400 text-xs italic ml-4">Rebecca is typing...</div>}
                       </div>
                       <div className="p-3 border-t bg-white flex gap-2">
                          <input 
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-blue-500 transition" 
                            placeholder="Message Rebecca..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage('rebecca')}
                          />
                          <button onClick={() => sendMessage('rebecca')} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"><Send size={18}/></button>
                       </div>
                     </>
                   ) : <div className="flex-1 flex items-center justify-center text-gray-400">Select a contact to chat</div>}
                </div>
              </div>
            )}

            {/* --- GAMES APP --- */}
            {window.type === 'games' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                 {/* Rock Paper Scissors */}
                 <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-purple-600">✂️ Rock Paper Scissors</h3>
                    <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                        {rpsResult ? (
                            <div className="text-center animate-in zoom-in">
                                <div className="text-4xl mb-2">{rpsResult.result === 'win' ? '🎉' : rpsResult.result === 'lose' ? '💀' : '🤝'}</div>
                                <div className="font-bold text-xl mb-1">{rpsResult.result.toUpperCase()}!</div>
                                <div className="text-sm text-gray-500">You: {rpsResult.user} vs AI: {rpsResult.ai}</div>
                                <button onClick={() => setRpsResult(null)} className="mt-4 text-blue-500 underline text-sm">Play Again</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 w-full">
                                {['rock', 'paper', 'scissors'].map(choice => (
                                    <button key={choice} onClick={() => playRPS(choice)} className="aspect-square bg-white border hover:bg-purple-50 rounded-lg text-2xl shadow-sm transition transform active:scale-95 capitalize">
                                        {choice === 'rock' ? '✊' : choice === 'paper' ? '✋' : '✌️'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-3 text-xs text-center text-gray-400">Wins: {rpsScore.user} | Losses: {rpsScore.ai}</div>
                 </div>

                 {/* Doodle Dash */}
                 <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-lg flex items-center gap-2 text-orange-600"><Edit3 size={18}/> Doodle Dash</h3>
                    </div>
                    
                    {!doodleGameActive ? (
                       <div className="flex-1 flex items-center justify-center bg-orange-50 rounded-lg border border-orange-100">
                           <button onClick={startDoodleGame} className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-orange-600 transition">Start New Game</button>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-2 h-full">
                          <div className="text-sm font-bold text-gray-700 bg-yellow-100 px-3 py-1 rounded-full">Draw: {doodleTarget}</div>
                          <canvas 
                             ref={doodleCanvasRef}
                             width={280} height={180}
                             className="border-2 border-dashed border-gray-300 rounded cursor-crosshair bg-white w-full flex-1 touch-none"
                             onMouseDown={(e) => { setIsDrawing(true); draw(e); }}
                             onMouseUp={() => { setIsDrawing(false); const ctx = doodleCanvasRef.current?.getContext('2d'); ctx?.beginPath(); }}
                             onMouseLeave={() => setIsDrawing(false)}
                             onMouseMove={draw}
                          />
                          <div className="flex gap-2 w-full">
                             <button onClick={startDoodleGame} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Trash2 size={16}/></button>
                             <button onClick={() => setDoodleGuess("Correct! (Simulated) ✅")} className="flex-1 bg-green-500 text-white rounded font-bold text-sm shadow hover:bg-green-600">Guess!</button>
                          </div>
                          {doodleGuess && <div className="text-sm font-bold text-green-600 animate-bounce">{doodleGuess}</div>}
                       </div>
                    )}
                 </div>
              </div>
            )}

            {/* --- PROFILE APP --- */}
            {window.type === 'profile' && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in">
                 <div className="relative group cursor-pointer">
                   {userAvatar ? (
                     <img src={userAvatar} alt="Pixel Avatar" className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-xl pixelated bg-black" />
                   ) : (
                     <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center text-4xl shadow-inner">👤</div>
                   )}
                   <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                 </div>
                 <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-800">{userName || 'Guest User'}</h2>
                    <p className="text-slate-500 font-mono text-sm mt-1">{userTimezone}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                        <div className="text-2xl font-bold text-purple-600">{rpsScore.user}</div>
                        <div className="text-xs text-purple-400 uppercase tracking-wide font-bold">RPS Wins</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">3</div>
                        <div className="text-xs text-orange-400 uppercase tracking-wide font-bold">Games Played</div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;