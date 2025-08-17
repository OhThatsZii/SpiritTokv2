import React, { useState } from 'react';
import { Camera, Edit3, Settings, Star, Users, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const ProfileSetup: React.FC = () => {
  const { user, setUser } = useApp();
  const [isEditing, setIsEditing] = useState(!user);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    specialties: user?.specialties || [],
    avatar: user?.avatar || '🔮',
  });

  const specialtyOptions = [
    'Tarot Reading', 'Astrology', 'Crystal Healing', 'Meditation',
    'Energy Healing', 'Numerology', 'Palm Reading', 'Chakra Balancing'
  ];

  const handleSave = () => {
    const newUser = {
      id: user?.id || '1',
      username: formData.username,
      avatar: formData.avatar,
      isLive: false,
      followers: user?.followers || 0,
      following: user?.following || 0,
      bio: formData.bio,
      specialties: formData.specialties,
    };
    setUser(newUser);
    setIsEditing(false);
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  if (isEditing) {
    return (
      <div className="p-4">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {user ? 'Edit Profile' : 'Create Your Profile'}
          </h2>

          {/* Avatar Selection */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              {formData.avatar}
            </div>
            <div className="flex justify-center space-x-2 flex-wrap">
              {['🔮', '🌙', '⭐', '💎', '🃏', '🕯️', '🦋', '🌸'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                  className={`w-10 h-10 rounded-full text-xl ${
                    formData.avatar === emoji ? 'bg-purple-500' : 'bg-black/30'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="Enter your username"
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 h-20 resize-none"
              placeholder="Tell others about your spiritual journey..."
            />
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Specialties</label>
            <div className="grid grid-cols-2 gap-2">
              {specialtyOptions.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => toggleSpecialty(specialty)}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    formData.specialties.includes(specialty)
                      ? 'bg-purple-500 text-white'
                      : 'bg-black/30 text-gray-400 hover:text-white'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            {user ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 mb-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            {user.avatar}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{user.username}</h1>
          <p className="text-gray-400 mb-4">{user.bio}</p>
          
          <div className="flex justify-center space-x-8 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{user.followers}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{user.following}</div>
              <div className="text-gray-400 text-sm">Following</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {user.specialties.map((specialty, index) => (
              <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                {specialty}
              </span>
            ))}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 mx-auto"
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 text-center border border-purple-500/20">
          <Heart className="text-pink-400 mx-auto mb-2" size={24} />
          <div className="text-lg font-bold text-white">1.2K</div>
          <div className="text-gray-400 text-sm">Likes</div>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 text-center border border-purple-500/20">
          <Users className="text-blue-400 mx-auto mb-2" size={24} />
          <div className="text-lg font-bold text-white">856</div>
          <div className="text-gray-400 text-sm">Views</div>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 text-center border border-purple-500/20">
          <Star className="text-yellow-400 mx-auto mb-2" size={24} />
          <div className="text-lg font-bold text-white">4.9</div>
          <div className="text-gray-400 text-sm">Rating</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;