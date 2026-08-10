import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, department, role } = req.body;
    const existing = await Employee.findOne({ employeeId });
    if (existing) return res.status(400).json({ message: 'Employee ID already exists' });

    const newEmp = await Employee.create({ employeeId, name, email, department, role });
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({employee:req.params.id});
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};