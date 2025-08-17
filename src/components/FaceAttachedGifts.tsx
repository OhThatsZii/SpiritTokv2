import React, { useState, useRef, useEffect } from 'react';
import { Gift, X, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface FaceGift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  attachment: 'head' | 'eyes' | 'mouth' | 'face';
  animation: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface FaceAttachedGiftsProps {
  streamerId: string;
  faces: any[];
  onGiftSent: (gift: FaceGift, amount: number) => void;
}

const FaceAttachedGifts: React.FC<FaceAttachedGiftsProps> = ({ streamerId, faces, onGiftSent }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [activeGifts, setActiveGifts] = useState<Map<string, { gift: FaceGift, timestamp: number }>>(new Map());
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const faceGifts: FaceGift[] = [
    // Head attachments
    { id: 'crown', name: 'Crown', emoji: '👑', price: 20, attachment: 'head', animation: '👑', rarity: 'rare' },
    { id: 'halo', name: 'Halo', emoji: '😇', price: 15, attachment: 'head', animation: '😇', rarity: 'rare' },
    { id: 'hat', name: 'Party Hat', emoji: '🎩', price: 10, attachment: 'head', animation: '🎩', rarity: 'common' },
    { id: 'horns', name: 'Devil Horns', emoji: '😈', price: 25, attachment: 'head', animation: '😈', rarity: 'epic' },
    
    // Eye attachments
    { id: 'heart-eyes', name: 'Heart Eyes', emoji: '😍', price: 5, attachment: 'eyes', animation: '❤️', rarity: 'common' },
    { id: 'star-eyes', name: 'Star Eyes', emoji: '🤩', price: 8, attachment: 'eyes', animation: '⭐', rarity: 'common' },
    { id: 'fire-eyes', name: 'Fire Eyes', emoji: '🔥', price: 15, attachment: 'eyes', animation: '🔥', rarity: 'rare' },
    { id: 'laser-eyes', name: 'Laser Eyes', emoji: '👁️‍🗨️', price: 30, attachment: 'eyes', animation: '⚡', rarity: 'epic' },
    
    // Mouth attachments
    { id: 'kiss', name: 'Kiss', emoji: '💋', price: 3, attachment: 'mouth', animation: '💋', rarity: 'common' },
    { id: 'rainbow', name: 'Rainbow', emoji: '🌈', price: 12, attachment: 'mouth', animation: '🌈', rarity: 'rare' },
    { id: 'fire-breath', name: 'Fire Breath', emoji: '🐉', price: 25, attachment: 'mouth', animation: '🔥', rarity: 'epic' },
    
    // Face overlays
    { id: 'sparkles', name: 'Sparkles', emoji: '✨', price: 8, attachment: 'face', animation: '✨', rarity: 'common' },
    { id: 'flowers', name: 'Flower Crown', emoji: '🌸', price: 18, attachment: 'face', animation: '🌸', rarity: 'rare' },
    { id: 'galaxy', name: 'Galaxy Face', emoji: '🌌', price: 50, attachment: 'face', animation: '🌌', rarity: 'legendary' },
    { id: 'diamond', name: 'Diamond Glow', emoji: '💎', price: 40, attachment: 'face', animation: '💎', rarity: 'epic' }
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

  useEffect(() => {
    // Clean up expired gifts
    const cleanup = setInterval(() => {
      const now = Date.now();
      const newActiveGifts = new Map(activeGifts);
      let hasChanges = false;

      activeGifts.forEach((giftData, id) => {
        if (now - giftData.timestamp > 10000) { // 10 seconds
          newActiveGifts.delete(id);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setActiveGifts(newActiveGifts);
      }
    }, 1000);

    return () => clearInterval(cleanup);
  }, [activeGifts]);

  const getAttachmentPosition = (face: any, attachment: string) => {
    const { x, y, width, height, landmarks } = face;
    
    switch (attachment) {
      case 'head':
        return { x: x + width / 2, y: y - 20 };
      case 'eyes':
        return landmarks?.leftEye && landmarks?.rightEye 
          ? { x: (landmarks.leftEye.x + landmarks.rightEye.x) / 2, y: (landmarks.leftEye.y + landmarks.rightEye.y) / 2 }
          : { x: x + width / 2, y: y + height * 0.3 };
      case 'mouth':
        return landmarks?.mouth 
          ? { x: landmarks.mouth.x, y: landmarks.mouth.y }
          : { x: x + width / 2, y: y + height * 0.7 };
      case 'face':
        return { x: x + width / 2, y: y + height / 2 };
      default:
        return { x: x + width / 2, y: y + height / 2 };
    }
  };

  const handleSendGift = async (gift: FaceGift) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
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

      // Add gift to active gifts
      const giftId = `${gift.id}-${Date.now()}`;
      setActiveGifts(prev => new Map(prev.set(giftId, { gift, timestamp: Date.now() })));

      onGiftSent(gift, gift.price);
      setShowGifts(false);
      
    } catch (error) {
      console.error('Gift sending failed:', error);
      alert('Failed to send gift. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10';
      case 'rare': return 'border-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Face-attached gift overlays */}
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-10">
        {faces.map((face, faceIndex) => (
          <div key={faceIndex}>
            {Array.from(activeGifts.values()).map((giftData, giftIndex) => {
              const position = getAttachmentPosition(face, giftData.gift.attachment);
              const age = Date.now() - giftData.timestamp;
              const opacity = Math.max(0, 1 - age / 10000);
              
              return (
                <div
                  key={`${faceIndex}-${giftIndex}`}
                  className="absolute text-4xl animate-pulse"
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    opacity,
                    animation: `bounce 1s infinite, fadeOut 10s linear forwards`
                  }}
                >
                  {giftData.gift.animation}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Gift selection panel */}
      <div ref={panelRef} className="relative">
        <button
          onClick={() => setShowGifts(!showGifts)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <Gift size={20} />
        </button>

        {showGifts && (
          <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-md rounded-lg p-4 border border-pink-500/20 w-96 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Face Gifts</h3>
              <button onClick={() => setShowGifts(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {faceGifts.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  disabled={isProcessing}
                  className={`${getRarityColor(gift.rarity)} hover:scale-105 border rounded-lg p-3 text-center transition-all disabled:opacity-50`}
                  title={`${gift.name} - Attaches to ${gift.attachment}`}
                >
                  <div className="text-2xl mb-1">{gift.emoji}</div>
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

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default FaceAttachedGifts;