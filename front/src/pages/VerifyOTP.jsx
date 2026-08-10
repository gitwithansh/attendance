import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function VerifyOTP() {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/verify-otp', { email: state?.email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await API.post('/auth/resend-otp', { email: state?.email });
      setMessage('A new OTP has been dispatched to your email.');
    } catch (err) {
      setError('Resend OTP action failed',err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray">
      <div className="w-full max-w-md p-8 bg-white border-t-4 rounded-lg shadow-lg border-yellow">
        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">Two-Factor Auth Verification</h2>
        <p className="mb-6 text-xs text-center text-gray-500">Enter code delivered to: {state?.email}</p>
        {error && <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
        {message && <div className="p-2 mb-4 text-sm text-green-600 bg-green-100 rounded">{message}</div>}
        <form onSubmit={handleVerify} className="space-y-4">
          <input type="text" maxLength="6" placeholder="6-digit OTP" required
            className="w-full p-2 text-xl tracking-widest text-center border rounded outline-green"
            value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button type="submit" className="w-full py-2 font-bold text-white transition rounded bg-green hover:bg-green-800">
            Verify & Authorize
          </button>
        </form>
        <button onClick={handleResend} className="w-full mt-3 text-sm font-semibold text-green">
          Didn't receive code? Resend OTP
        </button>
      </div>
    </div>
  );
}