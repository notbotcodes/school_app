const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB

const MONGO_URI = "mongodb+srv://anirudhsingh:zS4KyMV9pX61K7hq@cluster786a.lmw8y.mongodb.net/school?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
// Student Schema & Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  class: String,
  subjects: [String],
});

const Student = mongoose.model("Student", studentSchema);

// 🟢 **GET API - Fetch all students**
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔵 **POST API - Add a new student**
app.post("/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// 🟠 **PATCH API - Update a student by ID**
app.patch("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Update Failed" });
  }
});

// 🔴 **DELETE API - Remove a student by ID**
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete Failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
