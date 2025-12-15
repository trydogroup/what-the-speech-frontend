import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Wand2, Settings as SettingsIcon, Download } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { AppSettings, User } from '../types';
import { enhanceTextWithGemini } from '../services/geminiService';

interface DashboardProps {
  user: User;
  settings: AppSettings;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, settings, onOpenSettings }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  useEffect(() => {
    // Initialize SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         // Auto-restart if we think we are still listening (unless manually stopped)
         if (isListening) {
             // recognitionRef.current.start();
         } else {
             setIsListening(false);
         }
      };
    }

    // Global Hotkey Simulation (Spacebar)
    const handleKeyDown = (e: KeyboardEvent) => {
      // If we are in an input field, ignore
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' && !e.repeat && !isListening) {
        e.preventDefault(); // Prevent scrolling
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
       if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' && isListening) {
        stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, settings.language]);

  const startListening = () => {
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.log("Recognition already started");
    }
  };

  const stopListening = async () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    
    // Auto-enhance if enabled in settings
    if (settings.useGeminiEnhance) {
      await handleEnhance();
    }
  };

  const handleEnhance = async () => {
    if (!transcript) return;
    setIsEnhancing(true);
    const enhanced = await enhanceTextWithGemini(transcript);
    setTranscript(enhanced);
    setIsEnhancing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative">
      {/* Top Bar */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {!user.hasLicense && (
          <Badge variant="warning">Demo Mode</Badge>
        )}
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <SettingsIcon className="w-6 h-6 text-black/70" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black">What The Speech</h1>
          <p className="text-black/50">Hold <kbd className="bg-black/10 px-2 py-0.5 rounded text-sm font-sans">Space</kbd> to speak</p>
        </div>

        {/* Visualizer / Status */}
        <div className={`transition-all duration-300 ${isListening ? 'scale-110' : 'scale-100'}`}>
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${isListening ? 'bg-red-500 text-white shadow-red-200' : 'bg-black text-white'}`}>
            {isListening ? <Mic className="w-10 h-10 animate-pulse" /> : <MicOff className="w-10 h-10" />}
          </div>
        </div>

        {/* Transcript Area */}
        <Card className="min-h-[200px] flex flex-col relative text-left transition-shadow hover:shadow-md">
           <textarea 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your speech will appear here..."
            className="w-full h-full resize-none outline-none text-xl font-medium bg-transparent placeholder-gray-300 text-black leading-relaxed"
            rows={5}
           />
           
           <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400">
                {transcript.length} chars
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setTranscript("")} className="text-xs">Clear</Button>
                <Button 
                  variant="secondary" 
                  onClick={handleEnhance} 
                  isLoading={isEnhancing}
                  className="text-xs"
                  title="Fix grammar with Gemini"
                >
                  <Wand2 className="w-3 h-3 mr-2" />
                  Fix Grammar
                </Button>
                <Button variant="primary" onClick={handleCopy} className="text-xs">
                  {showCopyFeedback ? 'Copied!' : <><Copy className="w-3 h-3 mr-2" /> Copy</>}
                </Button>
              </div>
           </div>
        </Card>

        {/* Desktop Download Promo */}
        <div className="bg-white/50 border border-black/5 rounded-lg p-4 flex items-center justify-between">
          <div className="text-left">
            <h4 className="font-semibold text-sm">Download Native App</h4>
            <p className="text-xs text-black/50">Get global hotkeys on Windows & Mac.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="px-3 py-1.5 h-auto text-xs">
               <Download className="w-3 h-3 mr-1" /> Windows
            </Button>
            <Button variant="outline" className="px-3 py-1.5 h-auto text-xs">
               <Download className="w-3 h-3 mr-1" /> Mac
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
