import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <nav className="text-gray-700 bg-green-600 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xl font-extrabold text-gray-700 rounded">blinkit</span>
          <span className="pl-2 text-lg font-semibold tracking-wide border-l border-green-600">Attendance Portal</span>
        </div>
        <div className="flex items-center space-x-6 font-medium">
          <Link to="/employees" className="text-gray-700 transition hover:text-yellow">Employees</Link>
          <Link to="/attendance" className="transition hover:text-yellow">Mark Attendance</Link>
          <Link to="/records" className="transition hover:text-yellow">History & Export</Link>
          <span className="px-2 py-1 text-xs rounded">Admin: {admin.name}</span>
          <button onClick={handleLogout} className="px-3 py-1 text-sm text-white transition bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}