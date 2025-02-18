'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

interface Props {
  isControlled?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  buttonText?: string;
}

export default function Subscribe({ isControlled, isOpen: controlledIsOpen, onClose, buttonText = 'SUBSCRIBE' }: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const handleClose = isControlled ? onClose : () => setInternalIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      // Track successful subscription
      track('Email Subscription', {
        status: 'success',
        source: isControlled ? 'shop_status' : 'footer'
      });

      setStatus('success');
      setMessage('WELCOME TO FUNERAL');
      setEmail('');
      setTimeout(() => {
        handleClose?.();
      }, 2000);
    } catch (error) {
      // Track failed subscription
      track('Email Subscription', {
        status: 'error',
        source: isControlled ? 'shop_status' : 'footer'
      });

      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  // Track when modal is opened
  const handleOpen = () => {
    track('Subscription Modal Opened', {
      source: 'footer'
    });
    setInternalIsOpen(true);
  };

  return (
    <>
      {!isControlled && (
        <button
          onClick={handleOpen}
          className="hover:text-white transition-colors font-['Helvetica_Neue']"
        >
          {buttonText}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 font-['Helvetica_Neue']">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 animate-backdrop-in" 
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-md animate-modal-in">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-6" /> {/* Spacer for visual balance */}
                  <h2 className="text-lg font-medium text-zinc-200">FUNERAL</h2>
                  <button
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors w-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Join our private list for member-exclusive drops. Release times and details are shared only with subscribers—no public announcements.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-3 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-white hover:bg-zinc-100 text-black font-medium py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SUBSCRIBING...
                      </span>
                    ) : 'GET NOTIFIED'}
                  </button>

                  {message && (
                    <div className={`mt-3 text-sm ${status === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 