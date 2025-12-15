import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, AlertCircle, Server, RefreshCw } from 'lucide-react';
import { Button, Input, Card } from './UI';
import { User } from '../types';

interface PaymentProps {
  user: User;
  onSuccess: (licenseKey: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMode, setSuccessMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // URL logic: If on localhost, assume standard port 3000. If deployed, use relative path.
  const API_URL = "https://what-the-speech-backend.onrender.com/api";

  // Check Backend Status on Mount
  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch(`${API_URL}/status`);
      if (res.ok) setBackendStatus('online');
      else setBackendStatus('offline');
    } catch (e) {
      setBackendStatus('offline');
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    // Force check server before attempting payment
    if (backendStatus === 'offline') {
      setError("Cannot connect to server. Please run 'node backend/server.js' in your terminal.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order
      const response = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      
      const orderData = await response.json();

      // 2. Open Razorpay
      const options = {
        key: "rzp_live_Rro6u2W3PK2IXg", // YOUR LIVE KEY
        amount: orderData.amount,
        currency: orderData.currency,
        name: "What The Speech",
        description: "Lifetime License",
        order_id: orderData.id,
        prefill: {
          name: user.name,
          email: user.email, 
          contact: "" 
        },
        theme: { color: "#1A1A1A" },
        handler: function (response: any) {
          console.log("Payment Captured:", response);
          setSuccessMode(true);
        },
        modal: {
          ondismiss: function() { setLoading(false); }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError("Payment failed by user or bank.");
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
        setError("Network Error: Backend server is not reachable. Is it running on port 3000?");
      } else {
        setError(err.message || "Payment initiation failed.");
      }
      setLoading(false);
    }
  };

  if (successMode) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-black/60 mb-6">
          Your lifetime license key has been emailed to <br/><strong className="text-black">{user.email}</strong>.
        </p>
        <Card className="bg-cream-dark border-transparent p-4 mb-8">
           <p className="text-sm text-black/50">
             Please check your Inbox (and Spam folder) for an email from <strong>WTS By Trydo</strong>.
           </p>
        </Card>
        <Button onClick={() => window.location.reload()} variant="outline">Return to App</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      {/* Backend Status Indicator */}
      <div className="mb-6 flex justify-center">
        <div 
          onClick={checkServer}
          className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
          backendStatus === 'online' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <Server size={12} />
          {backendStatus === 'online' ? 'Server Connected' : 'Server Offline (Click to Retry)'}
          {backendStatus === 'checking' && <RefreshCw size={12} className="animate-spin" />}
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Unlock Pro Access</h2>
        <p className="text-black/60">One-time payment. Lifetime access.</p>
      </div>

      <Card className="p-8 shadow-lg border-black/5">
        <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
           <div>
             <h3 className="font-bold text-lg">Lifetime License</h3>
             <p className="text-sm text-black/50">What The Speech Desktop App</p>
           </div>
           <div className="text-right">
             <span className="text-2xl font-bold">₹499</span>
             <span className="block text-xs text-green-600 font-medium">One-time fee</span>
           </div>
        </div>

        <div className="space-y-4 mb-8">
           <Input label="Email for License" value={user.email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
           <p className="text-xs text-black/40">License key will be sent to this email immediately.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-4 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <Button 
          onClick={handleRazorpayPayment} 
          className="w-full py-4 text-lg bg-black text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg" 
          isLoading={loading}
          disabled={backendStatus === 'offline'}
        >
          {backendStatus === 'offline' ? 'Server Not Running' : 'Pay ₹499 & Unlock'}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-black/40 mt-6">
           <ShieldCheck size={12} />
           <span>Secured by Razorpay. 100% Safe & Secure.</span>
        </div>
      </Card>
    </div>
  );
};

export default Payment;
