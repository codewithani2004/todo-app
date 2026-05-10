
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection (LOCAL বা .env যেটা use করো)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));


// Schema
const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  }
});

const Todo = mongoose.model("Todo", TodoSchema);


// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});


// GET Todos
app.get("/get", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});


// ADD Todo (Duplicate check + proper status)
app.post("/add", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ message: "Task is required" });
    }

    const exists = await Todo.findOne({ task });

    if (exists) {
      return res.status(409).json({ message: "❌ Already Exists" });
    }

    const newTodo = new Todo({ task });
    await newTodo.save();

    res.status(201).json({ message: "✅ Todo Added" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// CLEAR ALL Todos
app.delete("/clear", async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ message: "🧹 All Todos Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing todos" });
  }
});


// DELETE single todo (optional but useful)
app.delete("/delete/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});


// Server start
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});