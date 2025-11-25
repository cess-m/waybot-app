// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// MIDDLEWARE (Allows your React app to talk to this server)
app.use(cors());
app.use(express.json());

// 1. CONNECT TO MONGODB
// We will create the .env file in the next step
mongoose.connect("mongodb+srv://admin_cess:LJa3B6QudQ0GBahy@cluster0.6zc0fbj.mongodb.net/waybot?appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 2. DEFINE DATA MODELS (Schemas)
// This tells MongoDB what your data looks like

// Schema for Individual Questions/Logs
const LogSchema = new mongoose.Schema({
  id: String,       // We keep your timestamp ID
  student: String,
  topicId: String,
  concept: String,
  question: String,
  explanation: String,
  confused: Boolean,
  timestamp: Number
});
const Log = mongoose.model("Log", LogSchema);

// Schema for Full Chat History
const ChatSchema = new mongoose.Schema({
  historyKey: String, // e.g., "cess-limits"
  messages: Array     // Stores the entire conversation
});
const Chat = mongoose.model("Chat", ChatSchema);

// 3. API ROUTES (The Endpoints)

// GET all logs (For your Teacher Dashboard)
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST (Save) a new log/question
app.post("/api/logs", async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.json(newLog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT (Update) feedback (Got it / Confused)
app.put("/api/logs/:id", async (req, res) => {
  try {
    const { confused } = req.body;
    // Find by your custom 'id', not the MongoDB '_id'
    await Log.findOneAndUpdate({ id: req.params.id }, { confused });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET Chat History
app.get("/api/chat/:key", async (req, res) => {
  try {
    const chat = await Chat.findOne({ historyKey: req.params.key });
    res.json(chat ? chat.messages : []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST (Save) Chat History
app.post("/api/chat", async (req, res) => {
  try {
    const { historyKey, messages } = req.body;
    // Upsert: Create if new, Update if exists
    await Chat.findOneAndUpdate(
      { historyKey },
      { messages },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE All Data (Reset Button)
app.delete("/api/reset", async (req, res) => {
  await Log.deleteMany({});
  await Chat.deleteMany({});
  res.json({ success: true });
});

// DELETE: Clear specific chat history
app.delete("/api/chat/:key", async (req, res) => {
  try {
    await Chat.findOneAndDelete({ historyKey: req.params.key });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Handle "Soft Login" (Create user if new, update lastActive if exists)
app.post("/api/login", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username: username }, 
      { $set: { lastActive: Date.now() } }, 
      { upsert: true, new: true, setDefaultsOnInsert: true } 
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all students
app.get("/api/users", async (req, res) => {
  const users = await User.find().sort({ lastActive: -1 });
  res.json(users);
});

// 4. START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Schema for Students/Users
const UserSchema = new mongoose.Schema({
  username: String,
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);