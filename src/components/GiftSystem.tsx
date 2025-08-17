import React, { useState, useRef, useEffect } from 'react';
import { Gift, Heart, Star, Crown, Diamond, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Gift {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  animation: string;
}

interface GiftSystemProps {
  streamerId: string;
  onGiftSent: (gift: Gift, amount: number) => void;
}

const GiftSystem: React.FC<GiftSystemProps> = ({ streamerId, onGiftSent }) => {
  const { user } = useAuth();
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const gifts: Gift[] = [
    {
      id: 'heart',
      name: 'Heart',
      icon: <Heart className="text-red-500" size={24} />,
      price: 1,
      animation: '💖'
    },
    {
      id: 'star',
      name: 'Star',
      icon: <Star className="text-yellow-500" size={24} />,
      price: 5,
      animation: '⭐'
    },
    {
      id: 'crystal',
      name: 'Crystal',
      icon: <Diamond className="text-purple-500" size={24} />,
      price: 10,
      animation: '💎'
    },
    {
      id: 'crown',
      name: 'Crown',
      icon: <Crown className="text-yellow-600" size={24} />,
      price: 25,
      animation: '👑'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowGifts(false);
      }
    };

    if (showGifts) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGifts]);

  const handleSendGift = async (gift: Gift) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      // For demo purposes, simulate payment success
      // In production, this would call the Stripe payment processing
      const simulatePayment = new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });

      const result = await simulatePayment as { success: boolean };

      if (result.success) {
        // Record the transaction in the database
        const { error: dbError } = await supabase
          .from('gift_transactions')
          .insert([{
            sender_id: user.id,
            receiver_id: streamerId,
            gift_type: gift.id,
            amount: gift.price,
            platform_fee: Math.round(gift.price * 0.25 * 100) / 100,
            streamer_amount: Math.round(gift.price * 0.75 * 100) / 100,
            status: 'completed'
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
        }

        onGiftSent(gift, gift.price);
        setShowGifts(false);
        
        // Show animation
        const animation = document.createElement('div');
        animation.innerHTML = gift.animation;
        animation.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce z-50 pointer-events-none';
        animation.style.animation = 'bounce 1s ease-in-out 3';
        document.body.appendChild(animation);
        
        setTimeout(() => {
          if (document.body.contains(animation)) {
            document.body.removeChild(animation);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Gift sending failed:', error);
      alert('Failed to send gift. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setShowGifts(!showGifts)}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
      >
        <Gift size={20} />
      </button>

      {showGifts && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <Gift className="mr-2" size={16} />
              Send a Gift
            </h3>
            <button
              onClick={() => setShowGifts(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleSendGift(gift)}
                disabled={isProcessing}
                className="bg-black/50 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 rounded-lg p-3 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center space-y-2">
                  {gift.icon}
                  <span className="text-white text-sm font-medium">{gift.name}</span>
                  <span className="text-purple-400 text-xs">${gift.price}</span>
                </div>
              </button>
            ))}
          </div>

          {isProcessing && (
            <div className="mt-3 text-center">
              <div className="text-purple-400 text-sm">Processing gift...</div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <p className="text-gray-400 text-xs text-center">
              Streamer receives 75% • Platform fee 25%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftSystem;