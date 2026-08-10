import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data } = await API.get('/employees');
      setEmployees(data);
      const initial = {};
      data.forEach(e => { initial[e._id] = 'Full Day'; });
      setAttendance(initial);
    };
    init();
  }, []);

  const handleStatusChange = (empId, status) => {
    setAttendance(prev => ({ ...prev, [empId]: status }));
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.keys(attendance).map(empId => {
        
        // employee: empId,
        // status: attendance[empId]
        const empData=employees.find(emp=>emp._id===empId);
        return{
            employee:{
                employeeId:empData?.employeeId||'',
                name:empData?.name||'',
                department:empData?.department||'',
                _id:empId
            },
            status:attendance[empId]
        }
      });
      await API.post('/attendance/mark', { attendanceData: payload, date });
      setMessage('Attendance updated successfully!');
    } catch (err) {
      setMessage('Failed to mark attendance.',err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl p-6 mx-auto">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mark Daily Attendance</h2>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded border-green" />
          </div>
          {message && <div className="p-2 mb-4 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
          <div className="space-y-4">
            {employees.map(emp => (
              <div key={emp._id} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-bold">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.employeeId} - {emp.department}</p>
                </div>
                <div className="flex space-x-2">
                  {['Full Day', 'Half Day', 'Absent'].map(status => (
                    <button key={status} onClick={() => handleStatusChange(emp._id, status)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        attendance[emp._id] === status 
                          ? 'bg-green text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="w-full py-3 mt-6 font-black transition rounded bg-yellow text-dark hover:bg-yellow-400">
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}