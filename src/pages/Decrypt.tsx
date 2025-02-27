import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Unlock, Copy } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { decryptMessage } from '../lib/encryption';

const Decrypt: React.FC = () => {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [key, setKey] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDecrypt = () => {
    if (!encryptedMessage || !key) return;
    
    setLoading(true);
    setError('');
    
    try {
      const decrypted = decryptMessage(encryptedMessage, key);
      
      if (!decrypted) {
        setError('Decryption failed. Please check your key and encrypted message.');
        setDecryptedMessage('');
      } else {
        setDecryptedMessage(decrypted);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      setError('Invalid key or corrupted message. Decryption failed.');
      setDecryptedMessage('');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 z-0"></div>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-white">Decrypt Message</h1>
          <p className="text-gray-400 mt-2">
            Reveal the original content with the correct decryption key
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Unlock className="mr-2 text-purple-500" size={20} />
              Decrypt Input
            </h2>
            
            <div className="mb-4">
              <label htmlFor="encrypted-message" className="block text-sm font-medium text-gray-300 mb-1">
                Encrypted Message
              </label>
              <textarea
                id="encrypted-message"
                rows={6}
                value={encryptedMessage}
                onChange={(e) => setEncryptedMessage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                placeholder="Paste the encrypted message here..."
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="decryption-key" className="block text-sm font-medium text-gray-300 mb-1">
                Decryption Key
              </label>
              <input
                id="decryption-key"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                placeholder="Enter the decryption key"
              />
            </div>
            
            <Button
              onClick={handleDecrypt}
              loading={loading}
              disabled={!encryptedMessage || !key}
              className="w-full"
            >
              Decrypt Message
            </Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Unlock className="mr-2 text-pink-500" size={20} />
              Decrypted Result
            </h2>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-md mb-4"
              >
                {error}
              </motion.div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Original Message
              </label>
              <div className="relative">
                <textarea
                  rows={6}
                  readOnly
                  value={decryptedMessage}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  placeholder="Decrypted message will appear here..."
                />
                {decryptedMessage && (
                  <button
                    onClick={() => copyToClipboard(decryptedMessage)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
              {copied && (
                <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            <div className="bg-gray-800/50 rounded-md p-4 text-sm text-gray-300">
              <p className="font-medium text-white mb-2">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The system uses AES-256 encryption with PBKDF2 key derivation.</li>
                <li>The key is used to derive a secure encryption key through multiple iterations.</li>
                <li>Only the correct key will successfully decrypt the message.</li>
                <li>If decryption fails, check that you have the exact key and complete encrypted message.</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Decrypt;