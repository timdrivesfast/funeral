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
          <div className="relative w-full max-w-xl sm:max-w-lg animate-modal-in">
            <div className="bg-white border border-blue-200 rounded-xl shadow-lg overflow-hidden">
              {/* Windows XP/Vista style header with gradient */}
              <div className="bg-gradient-to-b from-blue-400 to-blue-500 p-3 flex justify-between items-center">
                <div className="w-6" /> {/* Spacer for visual balance */}
                <h2 className="text-lg font-medium text-white drop-shadow-sm">funeral</h2>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-white/80 transition-colors w-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="p-6 bg-gradient-to-b from-white to-blue-50">


                <div className="space-y-4 mb-6">
                  <p className="text-sm text-zinc-700 leading-relaxed">
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
                        className="w-full bg-white border border-blue-200 rounded-full px-5 py-3 text-zinc-800 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-b from-[#FF9BC0]/90 to-[#FF83B1] hover:from-[#FFAED0] hover:to-[#FF9BC0] text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide uppercase relative overflow-hidden shadow-md"
                  >
                    {/* Vista glass reflection effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent"></div>
                    </div>
                    
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="relative z-10">SUBSCRIBING...</span>
                      </span>
                    ) : <span className="relative z-10">GET NOTIFIED</span>}
                  </button>

                  {message && (
                    <div className={`mt-4 text-center text-sm font-medium ${status === 'error' ? 'text-red-500' : 'text-[#FF9BC0]'}`}>
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