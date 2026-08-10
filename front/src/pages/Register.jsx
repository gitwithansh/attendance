import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password validation check
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match!');
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert(response.data.message || 'Admin Registered Successfully!');
      navigate('/login'); // Registration ke baad direct login page par bhej dega
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray">
      <div className="w-full max-w-md p-8 bg-white border-t-4 rounded-lg shadow-lg border-green">
        {/* Blinkit Branding Header */}
        <div className="mb-6 text-center">
          <span className="px-3 py-1 text-3xl font-black rounded bg-yellow text-dark">
            blinkit
          </span>
          <h2 className="mt-3 text-xl font-bold text-gray-800">New Admin Registration</h2>
          <p className="mt-1 text-xs text-gray-500">Create an account to manage store attendance</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-3 py-2 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              className="w-full p-2 mt-1 text-sm border rounded outline-green"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@blinkit.com"
              className="w-full p-2 mt-1 text-sm border rounded outline-green"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-2 mt-1 text-sm border rounded outline-green"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-2 mt-1 text-sm border rounded outline-green"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 font-bold text-white transition duration-200 rounded bg-green hover:bg-green-800"
          >
            {loading ? 'Registering Admin...' : 'Register as Admin'}
          </button>
        </form>

        {/* Navigation Link to Login */}
        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-green hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}