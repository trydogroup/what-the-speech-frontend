import React from 'react';
import { Card, Button } from '../components/UI';
import { ArrowLeft, Server, Terminal, Package } from 'lucide-react';

export const Docs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-cream p-6 flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Developer Documentation</h1>
        </div>

        <Card className="prose max-w-none">
          <h3>Architecture Overview</h3>
          <p>
            What The Speech is architected as a hybrid desktop application. 
            The core engine uses React for UI and Electron/Tauri for the OS-layer (global hotkeys).
          </p>

          <hr className="border-gray-100 my-4"/>

          <div className="flex items-center gap-2 font-semibold text-lg text-black mb-2">
            <Server size={20} /> Backend Deployment
          </div>
          <p className="text-sm mb-4">The backend handles licensing validation and payment webhooks.</p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono mb-6">
            <p># 1. Install Dependencies</p>
            <p className="text-green-400">npm install express firebase-admin stripe razorpay</p>
            <br />
            <p># 2. Deploy to Cloud Functions</p>
            <p className="text-green-400">firebase deploy --only functions</p>
            <br />
            <p># 3. Environment Variables</p>
            <p>STRIPE_SECRET_KEY=sk_live_...</p>
            <p>RAZORPAY_KEY_SECRET=rzp_live_...</p>
            <p>GEMINI_API_KEY=AIzaSy...</p>
          </div>

          <div className="flex items-center gap-2 font-semibold text-lg text-black mb-2">
            <Package size={20} /> Build Desktop Apps
          </div>
          <p className="text-sm mb-4">Generating binaries for Windows (.exe) and Mac (.dmg).</p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono">
             <p># Build for Windows</p>
             <p className="text-green-400">npm run build:win</p>
             <p className="text-gray-500">Output: dist/WhatTheSpeech-Setup-1.0.0.exe</p>
             <br/>
             <p># Build for Mac (Universal)</p>
             <p className="text-green-400">npm run build:mac</p>
             <p className="text-gray-500">Output: dist/WhatTheSpeech-1.0.0.dmg</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
