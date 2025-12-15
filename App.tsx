import React, { useState, useEffect } from 'react';
import { User, AppSettings, License } from './types';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import { Docs } from './pages/Docs';
import { Button } from './components/UI';
import { checkDemoEligibility, recordDemoUsage } from './services/demoLimiter';
import { Lock } from 'lucide-react';

// Mock initial state
const INITIAL_USER: User = {
  id: 'usr_123',
  email: 'user@example.com',
  name: 'Demo User',
  hasLicense: false,
  currency: 'USD'
};

const INITIAL_SETTINGS: AppSettings = {
  hotkey: 'Space',
  language: 'en-US',
  autoPaste: false,
  useGeminiEnhance: true,
  theme: 'light',
  microphoneId: 'default'
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'splash' | 'dashboard' | 'payment' | 'settings' | 'docs'>('splash');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [license, setLicense] = useState<License | undefined>(undefined);
  
  // Demo restriction state
  const [demoAllowed, setDemoAllowed] = useState<boolean>(true);
  const [checkingDemo, setCheckingDemo] = useState<boolean>(true);

  // Initial Checks
  useEffect(() => {
    const init = async () => {
      // 1. Currency/IP Mock
      const currencies: User['currency'][] = ['USD', 'INR', 'GBP', 'EUR'];
      const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
      setUser(u => ({ ...u, currency: randomCurrency }));

      // 2. Check Demo Eligibility
      const status = await checkDemoEligibility();
      setDemoAllowed(status.allowed);
      setCheckingDemo(false);
    };

    init();
  }, []);

  const startDemo = () => {
    if (!demoAllowed) return;
    
    // Record usage immediately when entering dashboard
    recordDemoUsage();
    setDemoAllowed(false); // Update local state so back button shows locked
    setCurrentPage('dashboard');
  };

  const handleLicensePurchase = (key: string) => {
    const newLicense: License = {
      key,
      status: 'active',
      purchaseDate: new Date().toISOString(),
      amount: 999
    };
    setLicense(newLicense);
    setUser(u => ({ ...u, hasLicense: true, licenseKey: key }));
    setDemoAllowed(true); // Paying bypasses limits
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'splash':
        return (
          <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-4xl w-full flex flex-col items-center">
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-black">What The Speech</h1>
              
              <div className="space-y-4 mb-12 max-w-3xl">
                <p className="text-2xl md:text-3xl font-semibold leading-tight text-black">
                  The fastest people don’t type. <br/>
                  <span className="text-black/60">They talk — and let the system handle the rest.</span>
                </p>
                <p className="text-lg text-black/70 pt-4 leading-relaxed max-w-2xl mx-auto">
                  This is your personal, everywhere-ready voice-to-text engine. 
                  Hold Spacebar, speak naturally, release — your words appear instantly.
                  Works across every app, every screen, every workflow.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
                {/* Demo Card */}
                <div className={`bg-white p-8 rounded-xl border shadow-sm flex flex-col text-left transition-colors relative overflow-hidden ${!demoAllowed ? 'border-red-100 bg-red-50/30' : 'border-gray-100 hover:border-black/10'}`}>
                  
                  {!demoAllowed && (
                    <div className="absolute top-4 right-4 text-red-500 opacity-20">
                      <Lock size={100} />
                    </div>
                  )}

                  <div className="mb-4 relative z-10">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Try Demo 
                      <span className={`font-normal text-xs ml-1 px-2 py-0.5 rounded-full ${demoAllowed ? 'bg-black/5 text-black/60' : 'bg-red-100 text-red-600'}`}>
                        {demoAllowed ? 'One-Time Only' : 'Expired'}
                      </span>
                    </h3>
                  </div>
                  <p className="text-sm text-black/50 mb-8 flex-grow leading-relaxed relative z-10">
                    {demoAllowed 
                      ? "Test the tool once per device. We securely track usage with IP + system ID to prevent multiple trials."
                      : "You have already used your one-time demo on this device. Please purchase a license to continue."}
                  </p>
                  
                  <Button 
                    onClick={startDemo} 
                    variant="outline" 
                    className={`w-full relative z-10 ${!demoAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!demoAllowed || checkingDemo}
                  >
                    {checkingDemo ? 'Checking...' : (demoAllowed ? 'Start Demo' : 'Demo Used')}
                  </Button>
                </div>

                {/* Buy Card */}
                <div className="bg-black text-white p-8 rounded-xl border border-black shadow-lg flex flex-col text-left transform hover:-translate-y-1 transition-transform">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Buy License</h3>
                  </div>
                  <p className="text-sm text-white/60 mb-8 flex-grow leading-relaxed">
                    Get lifetime access for a one-time fee. Use it everywhere, forever.
                  </p>
                  <Button onClick={() => setCurrentPage('payment')} variant="secondary" className="w-full bg-white text-black hover:bg-gray-100 border-none">
                    Buy License
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 text-sm text-black/40">
                <button 
                  onClick={() => setCurrentPage('docs')}
                  className="hover:text-black underline decoration-black/20 underline-offset-4"
                >
                  Developer & Deployment Docs
                </button>
                <p className="font-medium text-xs uppercase tracking-widest opacity-60">
                  A product by Trydo Innovations Pvt. Ltd.
                </p>
              </div>

            </div>
          </div>
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            settings={settings} 
            onOpenSettings={() => setCurrentPage('settings')}
          />
        );
      case 'payment':
        return (
          <Payment 
            user={user} 
            onSuccess={handleLicensePurchase} 
          />
        );
      case 'settings':
        return (
          <Settings 
            user={user}
            settings={settings}
            license={license}
            onUpdateSettings={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'docs':
        return <Docs onBack={() => setCurrentPage('splash')} />;
      default:
        return <div>404</div>;
    }
  };

  return (
    <div className="font-sans text-black selection:bg-black/10">
      {renderContent()}
    </div>
  );
};

export default App;
