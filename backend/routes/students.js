const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Helper function to generate sample mock records if database is empty
const defaultSubjects = ['Database Systems', 'Java Programming', 'Data Structures', 'Web Development', 'Computer Networks'];
const defaultDepts = ['MCA', 'MBA'];
const defaultSems = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
const firstNames = ['Ananya','Rohan','Priya','Kabir','Ishita','Aarav','Meera','Vivaan','Sara','Dev'];
const lastNames = ['Sharma','Verma','Iyer','Khan','Reddy','Nair','Kapoor','Bose','Malhotra','Singh'];

function generateInitialSeed() {
  const list = [];
  const today = new Date();
  for (let i = 0; i < 20; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    const grades = {};
    defaultSubjects.forEach((s, idx) => { grades[s] = 60 + ((i * 11 + idx * 7) % 36); });
    
    const attendance = {};
    for (let d = 0; d < 14; d++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - d);
      const isoDate = dt.toISOString().slice(0, 10);
      const r = (i * 7 + d * 3) % 10;
      attendance[isoDate] = r < 7 ? 'present' : (r < 9 ? 'absent' : 'late');
    }

    list.push({
      customId: 'S' + Math.random().toString(36).slice(2, 9),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@cime.edu`,
      phone: `+91 9${100000000 + (i * 7654321) % 899999999}`,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      department: defaultDepts[i % defaultDepts.length],
      semester: defaultSems[i % defaultSems.length],
      enrollDate: new Date(today.getTime() - i * 864000000).toISOString().slice(0, 10),
      status: i % 7 === 0 ? 'inactive' : 'active',
      avatar: 'linear-gradient(135deg,#6d5df6,#46a0fc)',
      grades,
      attendance
    });
  }
  return list;
}

// GET /api/students - Fetch all students (Auto-seeds if DB is empty)
router.get('/', async (req, res) => {
  try {
    let students = await Student.find().sort({ createdAt: -1 });
    if (students.length === 0) {
      const seed = generateInitialSeed();
      students = await Student.insertMany(seed);
    }
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students - Create a student
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student({
      customId: 'S' + Math.random().toString(36).slice(2, 9),
      ...req.body
    });
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/students/:id - Update student profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/students/:id/attendance - Mark attendance
router.put('/:id/attendance', async (req, res) => {
  try {
    const { date, status } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    student.attendance.set(date, status);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/students/:id/grades - Update student single grade
router.put('/:id/grades', async (req, res) => {
  try {
    const { subject, score } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.grades.set(subject, score);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
