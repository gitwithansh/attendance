import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'Delivery Partner' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);