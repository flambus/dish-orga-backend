require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Render provides this port automatically
const PORT = process.env.PORT || 3000;

// 🌍 MongoDB connection (from environment variable)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// 📦 Schema
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Dish = mongoose.model('Dish', dishSchema);

// Middleware
app.use(cors()); // later you can restrict origin
app.use(express.json());
//app.use(express.static('.')); // serves index.html if deployed together

// health check
app.get('/', (req, res) => res.send('OK'));

// 📥 Get all dishes
app.get('/dishes', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// ➕ Add dish
app.post('/dishes', async (req, res) => {
  try {
    const { dish } = req.body;

    if (!dish || !dish.trim()) {
      return res.status(400).json({ error: 'Invalid dish' });
    }

    await Dish.create({ name: dish.trim() });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add dish' });
  }
});

app.delete('/dishes/:id', async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});