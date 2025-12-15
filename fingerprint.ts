/**
 * Generates a unique device fingerprint based on browser characteristics.
 * This helps identify users even if they clear cookies (to an extent)
 * and is used in conjunction with IP tracking on the backend.
 */
export const getDeviceFingerprint = async (): Promise<string> => {
  try {
    const parts: string[] = [];

    // 1. Basic Navigator Info
    parts.push(navigator.userAgent);
    parts.push(navigator.language);
    parts.push(navigator.hardwareConcurrency?.toString() || '');
    parts.push((navigator as any).deviceMemory?.toString() || '');
    parts.push(new Date().getTimezoneOffset().toString());

    // 2. Screen Info
    parts.push(`${window.screen.width}x${window.screen.height}`);
    parts.push(`${window.screen.colorDepth}`);

    // 3. Canvas Fingerprinting (The most unique part)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      
      // Text with varied fonts and colors
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("WhatTheSpeech", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Fingerprint", 4, 17);
      
      // Drawing lines and blending
      ctx.strokeStyle = ".05";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 50);
      ctx.stroke();

      parts.push(canvas.toDataURL());
    }

    // 4. Create a simple hash of the combined string
    const message = parts.join('###');
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  } catch (error) {
    console.error("Fingerprint generation failed", error);
    // Fallback to a random ID if generation fails (less secure but keeps app working)
    return `fallback-${Math.random().toString(36).substring(2)}`;
  }
};
