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
  mongoose.connect(process.env.MONGO_URI)
  
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 2. DEFINE DATA MODELS (Schemas)
// This tells MongoDB what your data looks like
const PORT = process.env.PORT || 5000;

// Schema for Individual Questions/Logs
const LogSchema = new mongoose.Schema({
  id: String,       // We keep your timestamp ID
  student: String,
  section: { type: String, default: "No Section" },
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
// Schema for Students/Users
const UserSchema = new mongoose.Schema({
  username: String,
  section: { type: String, default: "No Section" },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  termsAccepted: { type: Boolean, default: false },
  dataConsent: { type: Boolean, default: false },
  consentAnsweredAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false } 
});
const User = mongoose.model("User", UserSchema);
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
    const body = req.body;

    const section = (body.section && String(body.section).trim()) || "No Section";
    const student = (body.student && String(body.student).trim()) || "Unknown";

    const newLog = new Log({
      ...body,
      student,
      section,
      timestamp: body.timestamp || Date.now()
    });

    await newLog.save();

    // ✅ update user's lastActive whenever they ask a question
    await User.findOneAndUpdate(
      { username: student },
      { $set: { lastActive: new Date() }, $setOnInsert: { joinedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Update) feedback (Got it / Confused)
app.put("/api/logs/:id", async (req, res) => {
  try {
    const { confused, explanation } = req.body;

    const update = {};
    if (typeof confused !== "undefined") update.confused = confused;
    if (typeof explanation !== "undefined") update.explanation = explanation;

    await Log.findOneAndUpdate({ id: req.params.id }, update);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  try {
    await Log.deleteMany({});
    await Chat.deleteMany({});
    await User.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  const { username, section } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          lastActive: new Date(),
          ...(section ? { section } : {}),
        },
        $setOnInsert: { joinedAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const needsConsent = !(user.termsAccepted && user.dataConsent);

    console.log("LOGIN BODY:", req.body);
    console.log("LOGIN RESULT user:", user);
    console.log("LOGIN needsConsent:", needsConsent);

    return res.json({ user, needsConsent });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.put("/api/users/:username/consent", async (req, res) => {
  try {
    const { username } = req.params;
    const { termsAccepted, dataConsent } = req.body;

    const user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          termsAccepted: !!termsAccepted,
          dataConsent: !!dataConsent,
          consentAnsweredAt: new Date(),
          lastActive: new Date(),
        },
      },
      { new: true }
    );

    console.log("CONSENT PARAM username:", username);
    console.log("CONSENT BODY:", req.body);
    console.log("CONSENT UPDATED user:", user);

    return res.json({ ok: true, user });
  } catch (err) {
    console.error("CONSENT ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});



// GET: Get students (optionally include deleted)
app.get("/api/users", async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";

  const query = includeDeleted ? {} : { deleted: { $ne: true } };

  const users = await User.find(query).sort({ lastActive: -1 });
  res.json(users);
});


// DELETE: Soft delete a student (keeps logs)
app.delete("/api/users/:username", async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username).trim();

    const updated = await User.findOneAndUpdate(
      { username },
      { $set: { deleted: true } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// Schema for Sections
const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});
const Section = mongoose.model("Section", SectionSchema);

app.get("/api/sections", async (req, res) => {
  try {
    const sections = await Section.find().sort({ createdAt: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sections", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "Section name required" });

    const section = await Section.create({ name });
    res.json(section);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Section already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/sections/:id", async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. START SERVER
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));