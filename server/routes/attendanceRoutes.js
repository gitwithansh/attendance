import express from 'express';
import { markAttendance, getAttendanceRecords, exportExcel, exportPDF } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.post('/mark', markAttendance);
router.get('/records', getAttendanceRecords);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPDF);

export default router;