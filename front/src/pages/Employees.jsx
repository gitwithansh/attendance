import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ employeeId: '', name: '', email: '', department: '', role: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchEmployees = async () => {
    const { data } = await API.get('/employees');
    setEmployees(data);
  };

  useEffect(() => { const getEmployeesData=async()=>{await fetchEmployees();};getEmployeesData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/employees/${editingId}`, formData);
    } else {
      await API.post('/employees', formData);
    }
    setFormData({ employeeId: '', name: '', email: '', department: '', role: '' });
    setEditingId(null);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-5 bg-white border-t-2 rounded shadow border-green">
            <h3 className="mb-4 text-lg font-bold text-gray-700">{editingId ? 'Edit Employee' : 'Add New Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Employee ID" required className="w-full p-2 text-sm border rounded"
                value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} />
              <input type="text" placeholder="Full Name" required className="w-full p-2 text-sm border rounded"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email" required className="w-full p-2 text-sm border rounded"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="text" placeholder="Department" required className="w-full p-2 text-sm border rounded"
                value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
              <input type="text" placeholder="Role" required className="w-full p-2 text-sm border rounded"
                value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              <button type="submit" className="w-full p-2 text-sm font-semibold text-green-600 bg-green-200 rounded cursor-pointer">
                {editingId ? 'Update Employee' : 'Save Employee'}
              </button>
            </form>
          </div>

          <div className="p-5 bg-white rounded shadow md:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-gray-700">Employee Roster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Department</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-bold">{emp.employeeId}</td>
                      <td className="p-2">{emp.name}</td>
                      <td className="p-2">{emp.department}</td>
                      <td className="p-2">{emp.role}</td>
                      <td className="p-2 space-x-2">
                        <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}