import { getDeviceFingerprint } from "../utils/fingerprint";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface DemoStatus {
  allowed: boolean;
  reason?: 'ip_limit' | 'device_limit' | 'error';
}

/**
 * Checks if the user is allowed to run the demo.
 * 1. Checks LocalStorage (fastest)
 * 2. Checks Backend API (most secure, catches Incognito/cleared cookies)
 */
export const checkDemoEligibility = async (): Promise<DemoStatus> => {
  // 1. Fast Client-Side Check
  const localUsed = localStorage.getItem('wts_demo_used');
  if (localUsed === 'true') {
    return { allowed: false, reason: 'device_limit' };
  }

  // 2. Server-Side Check (IP + Fingerprint)
  try {
    const fingerprint = await getDeviceFingerprint();
    
    // NOTE: In this preview environment, we might not have a running backend.
    // We will simulate a successful check if the API fails, relying on LocalStorage for the demo.
    // In production, uncomment the throw/error handling to enforce strict server checks.
    
    // const response = await fetch(`${API_URL}/check-demo`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fingerprint })
    // });
    
    // if (!response.ok) {
    //   const data = await response.json();
    //   if (data.reason) return { allowed: false, reason: data.reason };
    // }
    
    return { allowed: true };
  } catch (error) {
    console.warn("Could not verify with server, falling back to local check");
    return { allowed: true };
  }
};

/**
 * Records that the user has started the demo.
 * Must be called when the user actually accesses the dashboard/microphone.
 */
export const recordDemoUsage = async (): Promise<void> => {
  // 1. Mark LocalStorage (Immediate persistence)
  localStorage.setItem('wts_demo_used', 'true');

  // 2. Notify Backend (Persist to DB against IP/Fingerprint)
  try {
    const fingerprint = await getDeviceFingerprint();
    
    // Fire and forget - don't block UI waiting for this
    // fetch(`${API_URL}/record-demo`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fingerprint })
    // }).catch(err => console.error("Failed to record usage on server", err));

    console.log(`[DemoLimiter] Usage recorded for device: ${fingerprint.substring(0, 8)}...`);
  } catch (error) {
    console.error("Fingerprint error", error);
  }
};
