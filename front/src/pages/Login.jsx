import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/login-initiate', formData);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray">
      <div className="w-full max-w-md p-8 bg-white border-t-4 rounded-lg shadow-lg border-green">
        <div className="mb-6 text-center">
          <span className="px-3 py-1 text-3xl font-black rounded bg-yellow text-dark">blinkit</span>
          <h2 className="mt-3 text-xl font-bold text-gray-800">Admin Sign In</h2>
        </div>
        {error && <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" required className="w-full p-2 mt-1 border rounded outline-green"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input type="password" required className="w-full p-2 mt-1 border rounded outline-green"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button disabled={loading} type="submit" className="w-full py-2 font-bold text-white transition rounded bg-green hover:bg-green-800">
            {loading ? 'Sending Verification Code...' : 'Get OTP Verification'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          New Admin? <Link to="/register" className="font-bold text-green">Register Here</Link>
        </p>
      </div>
    </div>
  );
}