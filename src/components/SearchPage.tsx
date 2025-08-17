import React, { useState } from 'react';
import { Search, TrendingUp, Hash, User } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const trendingTopics = [
    { tag: '#TarotReading', posts: '12.5K' },
    { tag: '#CrystalHealing', posts: '8.9K' },
    { tag: '#Astrology', posts: '15.2K' },
    { tag: '#Meditation', posts: '6.7K' },
    { tag: '#SpiritualGuidance', posts: '9.1K' },
  ];

  const suggestedUsers = [
    { username: 'tarot_master', avatar: '🃏', followers: '25K', specialty: 'Tarot Expert' },
    { username: 'crystal_witch', avatar: '💎', followers: '18K', specialty: 'Crystal Healing' },
    { username: 'astro_guide', avatar: '⭐', followers: '32K', specialty: 'Astrology' },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'users', label: 'Users' },
    { id: 'hashtags', label: 'Tags' },
    { id: 'live', label: 'Live' },
  ];

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for readers, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? 'bg-purple-500 text-white'
                : 'bg-black/30 text-gray-400 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Trending Topics */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="text-purple-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Trending</h2>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between bg-black/30 backdrop-blur-md rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center space-x-3">
                <Hash className="text-purple-400" size={16} />
                <span className="text-white font-medium">{topic.tag}</span>
              </div>
              <span className="text-gray-400 text-sm">{topic.posts} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <User className="text-purple-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Suggested Readers</h2>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between bg-black/30 backdrop-blur-md rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-white font-medium">{user.username}</div>
                  <div className="text-gray-400 text-sm">{user.specialty}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">{user.followers}</div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded-full mt-1">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;