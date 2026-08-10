import Attendance from '../models/Attendance.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit-table';

export const markAttendance = async (req, res) => {
  try {
    const { attendanceData, date } = req.body; // Array of { employeeId, status }
    
    const operations = attendanceData.map(item => ({
      updateOne: {
        filter: { employee: item.employee, date },
        update: { status: item.status, markedBy: req.admin.id },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);
    res.status(200).json({ message: 'Attendance records saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const records = await Attendance.find(filter)
      .populate('employee', 'employeeId name department role')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const records = await Attendance.find().populate('employee').sort({ date: -1 });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Employee ID', key: 'empId', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Department', key: 'dept', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    records.forEach(r => {
      worksheet.addRow({
        date: r.date,
        empId: r.employee?.employeeId || 'N/A',
        name: r.employee?.name || 'N/A',
        dept: r.employee?.department || 'N/A',
        status: r.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Blinkit_Attendance.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const records = await Attendance.find().populate('employee').sort({ date: -1 });
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Blinkit_Attendance.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Blinkit Employee Attendance Report', { align: 'center' });
    doc.moveDown();

    const table = {
      headers: ['Date', 'Emp ID', 'Name', 'Department', 'Status'],
      rows: records.map(r => [
        r.date,
        r.employee?.employeeId || 'N/A',
        r.employee?.name || 'N/A',
        r.employee?.department || 'N/A',
        r.status
      ])
    };

    await doc.table(table, { prepareHeader: () => doc.fontSize(10).font('Helvetica-Bold'), prepareRow: () => doc.fontSize(9).font('Helvetica') });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};