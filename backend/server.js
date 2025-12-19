const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Updated Part Schema with new fields (replacing old 'price')
const partSchema = new mongoose.Schema({
  partName: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  trim: { type: String, required: true },           // New field
  warranty: { type: String },                        // Optional
  marketPrice: { type: Number, required: true },    // New
  margin: { type: Number, required: true },         // e.g., 20 for 20%
  shipping: { type: Number, required: true },       // New
  totalPrice: { type: Number, required: true }      // Final price (can be calculated)
});

const Part = mongoose.model('Part', partSchema, 'partdetails');

// API Route to add a part
app.post('/api/parts', async (req, res) => {
  try {
    const newPart = new Part(req.body);
    await newPart.save();
    res.status(201).json({ message: 'Part added successfully', part: newPart });
  } catch (error) {
    res.status(400).json({ message: 'Error adding part', error: error.message });
  }
});

// Optional: GET all parts (helpful for testing)
app.get('/api/parts', async (req, res) => {
  try {
    const parts = await Part.find();
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts', error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port number ${PORT}`));