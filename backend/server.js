require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const bodyParser = require("body-parser");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 3001;

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || null,
});

const TODO_KEY = "todo_list";

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Initialize an empty TODO list in Redis on server startup
redis.exists(TODO_KEY).then((exists) => {
  if (!exists) {
    redis.set(TODO_KEY, JSON.stringify([]));
    console.log("Initialized empty TODO list in Redis");
  }
});

// Load route to get the TODO list
app.get("/load", async (req, res) => {
  try {
    const todoList = await redis.get(TODO_KEY);
    res.json(JSON.parse(todoList) || []);
  } catch (error) {
    console.error("Error loading TODO list:", error);
    res.status(500).json({ error: "Failed to load TODO list" });
  }
});

// Save route to store a new TODO list
app.post("/save", async (req, res) => {
  try {
    const todoList = req.body;
    if (!Array.isArray(todoList)) {
      return res
        .status(400)
        .json({ error: "Invalid data format. Expected an array." });
    }
    await redis.set(TODO_KEY, JSON.stringify(todoList));
    res.json({ status: "save successful" });
  } catch (error) {
    console.error("Error saving TODO list:", error);
    res.status(500).json({ error: "Failed to save TODO list" });
  }
});

// Clear route to empty the TODO list
app.get("/clear", async (req, res) => {
  try {
    await redis.set(TODO_KEY, JSON.stringify([]));
    res.json({ status: "clear successful" });
  } catch (error) {
    console.error("Error clearing TODO list:", error);
    res.status(500).json({ error: "Failed to clear TODO list" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
