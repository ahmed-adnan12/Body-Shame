const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let visitors = [];
let stories = [];

// ==================== VISITOR APIs ====================

app.post('/api/visitors', (req, res) => {
  try {
    const visitor = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      visitedAt: new Date()
    };
    visitors.push(visitor);
    res.json({ success: true, message: 'Visitor saved!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/visitors', (req, res) => {
  try {
    res.json({ success: true, visitors: visitors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ADMIN LOGIN ====================

app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    
    if (password === 'admin123') {
      res.json({ success: true, token: 'admin-token-12345' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== STORIES APIs ====================

app.get('/api/stories', (req, res) => {
  try {
    res.json({ success: true, stories: stories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/stories', (req, res) => {
  try {
    const story = {
      name: req.body.name || 'Anonymous',
      text: req.body.text,
      createdAt: new Date()
    };
    stories.push(story);
    res.json({ success: true, message: 'Story saved!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});