export interface User {
  id: string;
  email: string;
  name: string;
  hasLicense: boolean;
  licenseKey?: string;
  currency: 'INR' | 'USD' | 'GBP' | 'EUR';
}

export interface License {
  key: string;
  status: 'active' | 'inactive';
  purchaseDate: string;
  amount: number;
}

export interface AppSettings {
  hotkey: string;
  language: string;
  autoPaste: boolean;
  useGeminiEnhance: boolean;
  theme: 'light' | 'dark'; // We force light (cream) as per requirements, but keep structure valid
  microphoneId: string;
}

export interface TranscriptionResult {
  text: string;
  timestamp: number;
  isEnhanced: boolean;
}
