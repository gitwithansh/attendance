import express from 'express';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getEmployees).post(addEmployee);
router.route('/:id').put(updateEmployee).delete(deleteEmployee);

export default router;