import React, { useState, useRef, useEffect } from 'react';
import { Gift, X, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface TikTokGift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  animation: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

interface TikTokGiftsProps {
  streamerId: string;
  onGiftSent: (gift: TikTokGift, amount: number) => void;
}

const TikTokGifts: React.FC<TikTokGiftsProps> = ({ streamerId, onGiftSent }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const tikTokGifts: TikTokGift[] = [
    // Common gifts (1-5 coins)
    { id: 'rose', name: 'Rose', emoji: '🌹', price: 1, animation: '🌹', rarity: 'common', description: 'A beautiful rose' },
    { id: 'heart', name: 'Heart', emoji: '❤️', price: 1, animation: '❤️', rarity: 'common', description: 'Show some love' },
    { id: 'thumbs-up', name: 'Like', emoji: '👍', price: 2, animation: '👍', rarity: 'common', description: 'Give a thumbs up' },
    { id: 'clap', name: 'Clap', emoji: '👏', price: 2, animation: '👏', rarity: 'common', description: 'Applaud the performance' },
    { id: 'kiss', name: 'Kiss', emoji: '💋', price: 3, animation: '💋', rarity: 'common', description: 'Send a kiss' },
    { id: 'star', name: 'Star', emoji: '⭐', price: 5, animation: '⭐', rarity: 'common', description: 'You\'re a star!' },
    
    // Rare gifts (10-50 coins)
    { id: 'fire', name: 'Fire', emoji: '🔥', price: 10, animation: '🔥', rarity: 'rare', description: 'This is fire!' },
    { id: 'diamond', name: 'Diamond', emoji: '💎', price: 15, animation: '💎', rarity: 'rare', description: 'Precious diamond' },
    { id: 'crown', name: 'Crown', emoji: '👑', price: 20, animation: '👑', rarity: 'rare', description: 'You\'re royalty' },
    { id: 'rocket', name: 'Rocket', emoji: '🚀', price: 25, animation: '🚀', rarity: 'rare', description: 'To the moon!' },
    { id: 'rainbow', name: 'Rainbow', emoji: '🌈', price: 30, animation: '🌈', rarity: 'rare', description: 'Colorful rainbow' },
    { id: 'unicorn', name: 'Unicorn', emoji: '🦄', price: 40, animation: '🦄', rarity: 'rare', description: 'Magical unicorn' },
    { id: 'lightning', name: 'Lightning', emoji: '⚡', price: 50, animation: '⚡', rarity: 'rare', description: 'Electric energy' },
    
    // Epic gifts (75-300 coins)
    { id: 'sports-car', name: 'Sports Car', emoji: '🏎️', price: 75, animation: '🏎️', rarity: 'epic', description: 'Luxury sports car' },
    { id: 'helicopter', name: 'Helicopter', emoji: '🚁', price: 100, animation: '🚁', rarity: 'epic', description: 'Private helicopter' },
    { id: 'yacht', name: 'Yacht', emoji: '🛥️', price: 150, animation: '🛥️', rarity: 'epic', description: 'Luxury yacht' },
    { id: 'castle', name: 'Castle', emoji: '🏰', price: 200, animation: '🏰', rarity: 'epic', description: 'Majestic castle' },
    { id: 'airplane', name: 'Airplane', emoji: '✈️', price: 250, animation: '✈️', rarity: 'epic', description: 'Private jet' },
    { id: 'treasure', name: 'Treasure', emoji: '💰', price: 300, animation: '💰', rarity: 'epic', description: 'Treasure chest' },
    
    // Legendary gifts (500-2000 coins)
    { id: 'lion', name: 'Lion', emoji: '🦁', price: 500, animation: '🦁', rarity: 'legendary', description: 'King of the jungle' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉', price: 750, animation: '🐉', rarity: 'legendary', description: 'Mythical dragon' },
    { id: 'universe', name: 'Universe', emoji: '🌌', price: 1000, animation: '🌌', rarity: 'legendary', description: 'The entire universe' },
    { id: 'phoenix', name: 'Phoenix', emoji: '🔥🦅', price: 1500, animation: '🔥🦅', rarity: 'legendary', description: 'Legendary phoenix' },
    { id: 'tiktok', name: 'TikTok', emoji: '📱', price: 2000, animation: '📱', rarity: 'legendary', description: 'Ultimate TikTok gift' }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🎁' },
    { id: 'common', name: 'Common', icon: '⚪' },
    { id: 'rare', name: 'Rare', icon: '🔵' },
    { id: 'epic', name: 'Epic', icon: '🟣' },
    { id: 'legendary', name: 'Legendary', icon: '🟡' }
  ];

  const filteredGifts = selectedCategory === 'all' 
    ? tikTokGifts 
    : tikTokGifts.filter(gift => gift.rarity === selectedCategory);

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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10 hover:bg-gray-400/20';
      case 'rare': return 'border-blue-400 bg-blue-400/10 hover:bg-blue-400/20';
      case 'epic': return 'border-purple-400 bg-purple-400/10 hover:bg-purple-400/20';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20';
      default: return 'border-gray-400 bg-gray-400/10 hover:bg-gray-400/20';
    }
  };

  const createAdvancedAnimation = (gift: TikTokGift) => {
    // Find the video container to overlay gifts on the video
    const videoContainer = document.querySelector('.live-video-container');
    if (!videoContainer) {
      console.log('Video container not found, using body as fallback');
      // Fallback to body if video container not found
      createBodyAnimation(gift);
      return;
    }
    
    console.log('Creating gift animation for:', gift.name);
    const animations = [];
    const count = gift.rarity === 'legendary' ? 8 : gift.rarity === 'epic' ? 5 : gift.rarity === 'rare' ? 3 : 2;
    
    for (let i = 0; i < count; i++) {
      const animation = document.createElement('div');
      animation.innerHTML = gift.animation;
      animation.className = 'absolute text-6xl pointer-events-none';
      animation.style.zIndex = '99999';
      animation.style.position = 'absolute';
      
      // Get container dimensions
      const containerRect = videoContainer.getBoundingClientRect();
      const startX = Math.random() * Math.max(containerRect.width - 100, 100);
      const startY = Math.max(containerRect.height - 100, 50);
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = Math.random() * Math.max(containerRect.height / 2, 50);
      
      animation.style.left = startX + 'px';
      animation.style.top = startY + 'px';
      animation.style.transform = 'scale(0.5) rotate(0deg)';
      animation.style.opacity = '1';
      animation.style.transition = 'all 3s ease-out';
      animation.style.textShadow = '0 0 20px rgba(255, 255, 255, 1)';
      animation.style.fontSize = '4rem';
      
      // Add glow effect for higher rarity
      if (gift.rarity === 'legendary') {
        animation.style.filter = 'drop-shadow(0 0 15px gold) brightness(1.8)';
      } else if (gift.rarity === 'epic') {
        animation.style.filter = 'drop-shadow(0 0 12px purple) brightness(1.5)';
      } else if (gift.rarity === 'rare') {
        animation.style.filter = 'drop-shadow(0 0 8px blue) brightness(1.3)';
      } else {
        animation.style.filter = 'drop-shadow(0 0 5px white) brightness(1.2)';
      }
      
      videoContainer.appendChild(animation);
      animations.push(animation);
      
      // Force a reflow to ensure the element is rendered
      animation.offsetHeight;
      
      // Animate with delay
      setTimeout(() => {
        animation.style.left = endX + 'px';
        animation.style.top = endY + 'px';
        animation.style.transform = `scale(2.5) rotate(${360 + Math.random() * 360}deg)`;
        animation.style.opacity = '0';
      }, i * 200);
      
      // Remove element
      setTimeout(() => {
        if (videoContainer.contains(animation)) {
          videoContainer.removeChild(animation);
        }
      }, 3500 + i * 200);
    }
  };

  const createBodyAnimation = (gift: TikTokGift) => {
    // Fallback animation on the body
    const count = gift.rarity === 'legendary' ? 6 : gift.rarity === 'epic' ? 4 : gift.rarity === 'rare' ? 2 : 1;
    
    for (let i = 0; i < count; i++) {
      const animation = document.createElement('div');
      animation.innerHTML = gift.animation;
      animation.className = 'fixed text-6xl pointer-events-none';
      animation.style.zIndex = '99999';
      animation.style.position = 'fixed';
      
      const startX = Math.random() * (window.innerWidth - 100);
      const startY = window.innerHeight - 100;
      const endX = startX + (Math.random() - 0.5) * 300;
      const endY = Math.random() * (window.innerHeight / 3);
      
      animation.style.left = startX + 'px';
      animation.style.top = startY + 'px';
      animation.style.transform = 'scale(0.5) rotate(0deg)';
      animation.style.opacity = '1';
      animation.style.transition = 'all 3s ease-out';
      animation.style.textShadow = '0 0 20px rgba(255, 255, 255, 1)';
      
      // Add glow effect for higher rarity
      if (gift.rarity === 'legendary') {
        animation.style.filter = 'drop-shadow(0 0 15px gold) brightness(1.8)';
      } else if (gift.rarity === 'epic') {
        animation.style.filter = 'drop-shadow(0 0 12px purple) brightness(1.5)';
      } else if (gift.rarity === 'rare') {
        animation.style.filter = 'drop-shadow(0 0 8px blue) brightness(1.3)';
      }
      
      document.body.appendChild(animation);
      
      // Force a reflow
      animation.offsetHeight;
      
      // Animate with delay
      setTimeout(() => {
        animation.style.left = endX + 'px';
        animation.style.top = endY + 'px';
        animation.style.transform = `scale(2.5) rotate(${360 + Math.random() * 360}deg)`;
        animation.style.opacity = '0';
      }, i * 200);
      
      // Remove element
      setTimeout(() => {
        if (document.body.contains(animation)) {
          document.body.removeChild(animation);
        }
      }, 3500 + i * 200);
    }
  };

  const handleSendGift = async (gift: TikTokGift) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      const simulatePayment = new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });

      const result = await simulatePayment as { success: boolean };

      if (result.success) {
        const { error: dbError } = await supabase
          .from('gift_transactions')
          .insert([{
            sender_id: user.id,
            receiver_id: streamerId,
            gift_type: gift.id,
            amount: gift.price,
            platform_fee: Math.round(gift.price * 0.3 * 100) / 100,
            streamer_amount: Math.round(gift.price * 0.7 * 100) / 100,
            status: 'completed'
          }]);

        if (dbError) console.error('Database error:', dbError);

        onGiftSent(gift, gift.price);
        setShowGifts(false);
        
        createAdvancedAnimation(gift);
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
        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 relative"
      >
        <Gift size={20} />
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          <Coins size={12} />
        </div>
      </button>
      {showGifts && (
        <div className="fixed bottom-20 right-4 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-pink-500/20 w-80 max-h-96 overflow-y-auto shadow-xl z-[9999]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <Gift className="mr-2" size={16} />
              TikTok Gifts
            </h3>
            <button onClick={() => setShowGifts(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleSendGift(gift)}
                disabled={isProcessing}
                className={`${getRarityColor(gift.rarity)} hover:scale-105 border rounded-lg p-3 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group`}
                title={gift.description}
              >
                <div className="text-3xl mb-1 group-hover:animate-bounce">{gift.emoji}</div>
                <div className="text-white text-xs font-medium truncate">{gift.name}</div>
                <div className="text-pink-400 text-xs font-bold">{gift.price} 💎</div>
              </button>
            ))}
          </div>

          {isProcessing && (
            <div className="mt-3 text-center">
              <div className="text-pink-400 text-sm animate-pulse">✨ Sending gift...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TikTokGifts;
