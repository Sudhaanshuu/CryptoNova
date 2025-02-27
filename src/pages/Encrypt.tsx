import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Copy, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { encryptMessage, generateSecureKey } from '../lib/encryption';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Encrypt: React.FC = () => {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({ key: false, message: false });
  const { user } = useAuth();

  const handleGenerateKey = () => {
    const newKey = generateSecureKey();
    setKey(newKey);
  };

  const handleEncrypt = async () => {
    if (!message) return;
    
    setLoading(true);
    try {
      // Use the provided key or generate a new one
      const encryptionKey = key || generateSecureKey();
      if (!key) setKey(encryptionKey);
      
      // Encrypt the message
      const encrypted = encryptMessage(message, encryptionKey);
      setEncryptedMessage(encrypted);
      
      // Save to database if user is logged in
      if (user) {
        await supabase.from('encrypted_messages').insert({
          user_id: user.id,
          encrypted_text: encrypted
        });
      }
    } catch (error) {
      console.error('Encryption failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'message') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
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
          <h1 className="text-3xl font-bold text-white">Encrypt Your Message</h1>
          <p className="text-gray-400 mt-2">
            Secure your communications with AES-256 encryption and PBKDF2 key derivation
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2 text-purple-500" size={20} />
              Message Input
            </h2>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Enter your message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                placeholder="Type your secret message here..."
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="key" className="block text-sm font-medium text-gray-300">
                  Encryption Key
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateKey}
                  icon={<RefreshCw size={14} />}
                >
                  Generate
                </Button>
              </div>
              <div className="relative">
                <input
                  id="key"
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  placeholder="Enter or generate a key"
                />
                {key && (
                  <button
                    onClick={() => copyToClipboard(key, 'key')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
              {copied.key && (
                <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            <Button
              onClick={handleEncrypt}
              loading={loading}
              disabled={!message}
              className="w-full"
            >
              Encrypt Message
            </Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2 text-pink-500" size={20} />
              Encrypted Result
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Encrypted Message
              </label>
              <div className="relative">
                <textarea
                  rows={6}
                  readOnly
                  value={encryptedMessage}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  placeholder="Encrypted message will appear here..."
                />
                {encryptedMessage && (
                  <button
                    onClick={() => copyToClipboard(encryptedMessage, 'message')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
              {copied.message && (
                <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            <div className="bg-gray-800/50 rounded-md p-4 text-sm text-gray-300">
              <p className="font-medium text-white mb-2">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep your encryption key secure and separate from the encrypted message.</li>
                <li>Share the key through a different channel than the encrypted message.</li>
                <li>The recipient will need both the encrypted message and the key to decrypt.</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;