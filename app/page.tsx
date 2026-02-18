'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [storyText, setStoryText] = useState('');
  const [storyName, setStoryName] = useState('');
  const [loadingStories, setLoadingStories] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qr = params.get('qr');
    if (qr) {
      setShowModal(true);
    }
  }, []);

  const loadStories = async () => {
    setLoadingStories(true);
    try {
      const response = await fetch('http://localhost:5000/api/stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
    setLoadingStories(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Thank you ' + name + '! 💜');
        setShowModal(false);
        setName('');
        setEmail('');
        setPhone('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving visitor');
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storyText.trim()) {
      alert('Please write a story!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storyName || 'Anonymous',
          text: storyText
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Story shared! 💜');
        setStoryText('');
        setStoryName('');
        loadStories();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving story');
    }
  };

  const openStoriesModal = () => {
    setShowStoriesModal(true);
    loadStories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 px-5 py-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <div className="text-6xl mb-4">💜</div>
          <h1 className="text-5xl font-bold mb-3">Everybody Is Beautiful</h1>
          <p className="text-xl opacity-95">End Body Shaming, Celebrate Every Body</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 - Selfie */}
          <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4">🤳</div>
            <h3 className="text-2xl font-bold mb-3">Take Empowering Selfie</h3>
            <p className="text-sm opacity-90 mb-6">Beautiful, Strong, Unique, Worthy</p>
            <button 
              onClick={() => {
                window.location.href = 'https://snapchat.com/unlock/?b=YOUR_FILTER_CODE';
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              Explore
            </button>
          </div>

          {/* Card 2 - Stories */}
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold mb-3">Read Real Stories</h3>
            <p className="text-sm opacity-90 mb-6">Share inspiring stories from real people</p>
            <button 
              onClick={openStoriesModal}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              Explore
            </button>
          </div>

          {/* Card 3 - Share */}
          <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-4">📢</div>
            <h3 className="text-2xl font-bold mb-3">Share Campaign</h3>
            <p className="text-sm opacity-90 mb-6">Spread #EverybodyIsBeautiful</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all">
              Explore
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Body Positivity Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-purple-600">🎥 Watch Inspiring Video</h2>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mb-8">
          <a href="/admin" className="text-white opacity-60 hover:opacity-100 underline text-sm">
            Admin Access
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center text-white py-8">
          <h3 className="text-2xl font-bold">Remember: Every body is beautiful, including yours! 💜</h3>
        </footer>
      </div>

      {/* Visitor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h2 className="text-2xl font-bold text-white">Welcome! 💜</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stories Modal */}
      {showStoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl my-8">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold text-white">📖 Real Stories</h2>
              <button
                onClick={() => setShowStoriesModal(false)}
                className="text-white text-3xl font-bold hover:opacity-80 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {/* Add Story Form */}
              <form onSubmit={handleAddStory} className="bg-gray-50 p-4 rounded-lg border-2 border-blue-300">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={storyName}
                  onChange={(e) => setStoryName(e.target.value)}
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Share your body positivity story..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all"
                >
                  Post Story
                </button>
              </form>

              {/* Stories List */}
              <div className="space-y-3">
                {loadingStories ? (
                  <p className="text-center text-gray-500">Loading stories...</p>
                ) : stories.length === 0 ? (
                  <p className="text-center text-gray-500">No stories yet. Be the first to share! 💜</p>
                ) : (
                  stories.map((story, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-gray-800">{story.name}</h3>
                      <p className="text-gray-700 mt-2">{story.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}