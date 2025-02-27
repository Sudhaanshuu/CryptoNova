import CryptoJS from 'crypto-js';

// Advanced Encryption Standard (AES) with 256-bit key
export const encryptMessage = (message: string, key: string): string => {
  // Use PBKDF2 to derive a stronger key from the user's key
  const salt = CryptoJS.lib.WordArray.random(128/8);
  const iterations = 10000;
  const derivedKey = CryptoJS.PBKDF2(key, salt, {
    keySize: 256/32,
    iterations
  });
  
  // Encrypt the message using AES
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(message, derivedKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  
  // Combine the salt, iv, and ciphertext for storage
  const result = salt.toString() + ':' + iv.toString() + ':' + encrypted.toString();
  return result;
};

export const decryptMessage = (encryptedMessage: string, key: string): string => {
  try {
    // Split the combined string to get salt, iv, and ciphertext
    const parts = encryptedMessage.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted message format');
    }
    
    const salt = CryptoJS.enc.Hex.parse(parts[0]);
    const iv = CryptoJS.enc.Hex.parse(parts[1]);
    const ciphertext = parts[2];
    
    // Derive the same key using PBKDF2
    const iterations = 10000;
    const derivedKey = CryptoJS.PBKDF2(key, salt, {
      keySize: 256/32,
      iterations
    });
    
    // Decrypt the message
    const decrypted = CryptoJS.AES.decrypt(ciphertext, derivedKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// Generate a secure random key
export const generateSecureKey = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};