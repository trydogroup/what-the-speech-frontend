import React from 'react';
import { ArrowLeft, Mic, Keyboard, Languages, Wand2 } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { AppSettings, User, License } from '../types';

interface SettingsProps {
  settings: AppSettings;
  user: User;
  license?: License;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, user, license, onUpdateSettings, onBack }) => {
  return (
    <div className="min-h-screen bg-cream p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Account Section */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-black/40 mb-3">Account</h2>
            <Card className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-black/60">{user.email}</p>
              </div>
              <div>
                {user.hasLicense ? (
                   <div className="text-right">
                     <span className="text-green-600 font-medium text-sm">Pro Active</span>
                     <p className="text-xs text-black/40 font-mono mt-1">{license?.key}</p>
                   </div>
                ) : (
                  <span className="text-yellow-600 font-medium text-sm">Free Demo</span>
                )}
              </div>
            </Card>
          </section>

          {/* General Section */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-black/40 mb-3">General</h2>
            <Card className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/5 rounded-lg"><Keyboard size={18} /></div>
                  <div>
                    <p className="font-medium text-sm">Global Hotkey</p>
                    <p className="text-xs text-black/50">Shortcut to start listening</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                   <span className="text-xs font-mono font-medium">{settings.hotkey}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/5 rounded-lg"><Languages size={18} /></div>
                  <div>
                    <p className="font-medium text-sm">Input Language</p>
                    <p className="text-xs text-black/50">Language to transcribe</p>
                  </div>
                </div>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={settings.language}
                  onChange={(e) => onUpdateSettings({ language: e.target.value })}
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-IN">English (India)</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/5 rounded-lg"><Mic size={18} /></div>
                  <div>
                    <p className="font-medium text-sm">Microphone</p>
                    <p className="text-xs text-black/50">Default input device</p>
                  </div>
                </div>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black/10 max-w-[150px]"
                  value={settings.microphoneId}
                  onChange={(e) => onUpdateSettings({ microphoneId: e.target.value })}
                >
                  <option value="default">Default Device</option>
                  {/* In a real app, we would map media devices here */}
                </select>
              </div>

            </Card>
          </section>

          {/* AI Features */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-black/40 mb-3">Intelligence</h2>
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Wand2 size={18} /></div>
                  <div>
                    <p className="font-medium text-sm">Auto-Refine with Gemini</p>
                    <p className="text-xs text-black/50">Automatically fix grammar after speaking</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.useGeminiEnhance}
                    onChange={(e) => onUpdateSettings({ useGeminiEnhance: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </Card>
          </section>

           <div className="text-center pt-8">
              <p className="text-xs text-black/30">Version 1.0.0 • Build 2024.10</p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
