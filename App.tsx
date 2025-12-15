import React, { useState } from 'react';
import Payment from './pages/Payment';

// Minimal user object for payment page
const INITIAL_USER = {
  id: 'usr_123',
  email: 'user@example.com',
  name: 'Demo User',
  hasLicense: false,
  currency: 'INR'
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'payment'>('payment');

  const handleLicensePurchase = (key: string) => {
    console.log("License purchased:", key);
  };

  return (
    <div className="font-sans text-black selection:bg-black/10">
      <Payment user={INITIAL_USER} onSuccess={handleLicensePurchase} />
    </div>
  );
};

export default App;
