'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('visitors');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        loadAllData();
      } else {
        alert('❌ Invalid password! Try again.');
      }
    } catch (error) {
      alert('❌ Login failed');
    }

    setLoading(false);
  };

  const loadAllData = async () => {
    try {
      const [visitorsRes, storiesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/visitors'),
        fetch('http://localhost:5000/api/stories')
      ]);

      if (visitorsRes.ok) {
        const data = await visitorsRes.json();
        setVisitors(data.visitors || []);
      }

      if (storiesRes.ok) {
        const data = await storiesRes.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setVisitors([]);
    setStories([]);
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">Admin Login</h1>
            <p className="text-gray-600">Only authorized admins can access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? '🔄 Logging in...' : '🔓 Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Password: <code className="bg-gray-100 px-2 py-1 rounded font-mono">admin123</code>
          </p>

          <a href="/" className="block text-center text-purple-600 hover:underline mt-6 font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD (After Login)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🔐 Admin Dashboard</h1>
            <p className="opacity-90">Campaign Analytics & Visitor Information</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-bold mb-2">👥 Total Visitors</h3>
          <p className="text-4xl font-bold text-purple-600">{visitors.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-bold mb-2">📖 Total Stories</h3>
          <p className="text-4xl font-bold text-pink-600">{stories.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-bold mb-2">📧 With Email</h3>
          <p className="text-4xl font-bold text-blue-600">{visitors.filter(v => v.email).length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-bold mb-2">📱 With Phone</h3>
          <p className="text-4xl font-bold text-green-600">{visitors.filter(v => v.phone).length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex gap-4 border-b-2 border-gray-300">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`pb-4 px-6 font-bold text-lg transition-all ${
              activeTab === 'visitors'
                ? 'border-b-4 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👥 Visitors ({visitors.length})
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`pb-4 px-6 font-bold text-lg transition-all ${
              activeTab === 'stories'
                ? 'border-b-4 border-pink-600 text-pink-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📖 Stories ({stories.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        {activeTab === 'visitors' ? (
          // VISITORS TABLE - All Details
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-100 p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">🔍 Visitor Details</h2>
              <p className="text-gray-600 text-sm mt-1">Complete information about everyone who visited</p>
            </div>

            <div className="overflow-x-auto">
              {visitors.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">No visitors yet</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="p-4 text-left font-bold text-gray-700">#</th>
                      <th className="p-4 text-left font-bold text-gray-700">Name</th>
                      <th className="p-4 text-left font-bold text-gray-700">Email Address</th>
                      <th className="p-4 text-left font-bold text-gray-700">Phone Number</th>
                      <th className="p-4 text-left font-bold text-gray-700">Visit Date & Time</th>
                      <th className="p-4 text-left font-bold text-gray-700">User Agent (Device)</th>
                      <th className="p-4 text-left font-bold text-gray-700">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor, idx) => (
                      <tr key={idx} className="border-b hover:bg-blue-50 transition-all">
                        <td className="p-4 font-bold text-gray-700 bg-gray-50">{idx + 1}</td>
                        <td className="p-4 font-semibold text-gray-900">{visitor.name}</td>
                        <td className="p-4 text-gray-700">{visitor.email || '-'}</td>
                        <td className="p-4 font-mono font-bold text-gray-900 bg-yellow-50">
                          {visitor.phone || '-'}
                        </td>
                        <td className="p-4 text-gray-600 text-xs whitespace-nowrap">
                          {new Date(visitor.visitedAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-gray-600 text-xs max-w-xs truncate" title={visitor.userAgent || '-'}>
                          {visitor.userAgent || '-'}
                        </td>
                        <td className="p-4 text-gray-600 text-xs font-mono">
                          {visitor.ipAddress || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          // STORIES
          <div className="space-y-4">
            <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-pink-600">
              <h2 className="text-2xl font-bold text-gray-800">📖 All Stories</h2>
              <p className="text-gray-600 text-sm mt-1">Stories shared by visitors</p>
            </div>

            {stories.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                <p className="text-lg">No stories yet</p>
              </div>
            ) : (
              stories.map((story, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Story #{idx + 1}</h3>
                      <p className="text-gray-700 font-semibold">Author: {story.name}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(story.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{story.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-200 mt-12 py-8 text-center text-gray-700">
        <p className="text-sm font-semibold">🔐 Admin Protected Area - All Visitor Data Confidential</p>
      </div>
    </div>
  );
}