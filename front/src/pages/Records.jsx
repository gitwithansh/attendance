import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  const fetchRecords = async () => {
    const { data } = await API.get(`/attendance/records${filterDate ? `?date=${filterDate}` : ''}`);
    setRecords(data);
  };

  useEffect(() => { const loadData=async()=>{await fetchRecords();};loadData(); }, [filterDate]);

//   const handleDownload = (type) => {
//     const token = localStorage.getItem('token');
//     window.open(`http://localhost:5000/api/attendance/export/${type}?token=${token}`, '_blank');
//   };
const handleDownload = async (type) => {
  try {
    const token = localStorage.getItem('token');
    
    // Check karein agar token missing hai
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    const response = await API.get(`/attendance/export/${type}`, {
      headers: {
        Authorization: `Bearer ${token}` // Manually pass bearer token
      },
      responseType: 'blob', // Binary file receive karne ke liye mandatory
    });

    // File download trigger logic
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Blinkit_Attendance_${Date.now()}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert(`Unauthorized: Token validation failed (${type.toUpperCase()})`);
  }
};

  return (
    <div>
      <Navbar />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
            <h2 className="text-xl font-bold text-gray-800">Attendance History Logs</h2>
            <div className="flex items-center space-x-3">
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="p-2 text-sm border rounded" />
              <button onClick={() => handleDownload('excel')} className="px-3 py-2 text-sm font-bold text-white bg-green-700 rounded">
                Export Excel
              </button>
              <button onClick={() => handleDownload('pdf')} className="px-3 py-2 text-sm font-bold text-white bg-red-600 rounded">
                Export PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray">
                  <th className="p-2">Date</th>
                  <th className="p-2">Emp ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec._id} className="border-b">
                    <td className="p-2">{rec.date}</td>
                    <td className="p-2 font-mono">{rec.employee?.employeeId}</td>
                    <td className="p-2">{rec.employee?.name}</td>
                    <td className="p-2">{rec.employee?.department}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        rec.status === 'Full Day' ? 'bg-green-100 text-green-800' :
                        rec.status === 'Half Day' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}