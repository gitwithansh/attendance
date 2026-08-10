import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // LocalStorage se JWT token check karenge
  const token = localStorage.getItem('token');

  // Agar token exist nahi karta toh admin ko login page par redirect kar do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar token hai toh requested component (page) render kar do
  return children;
}