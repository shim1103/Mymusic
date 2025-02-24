import { Navigate, Outlet } from 'react-router-dom';

// get user's access information
const useAuth = () => {
  const authToken = localStorage.getItem('authToken');
  return !!authToken;
};

// authenticated user can get contents
const ProtectedRoute = () => {
  const isAuthenticated = useAuth();
  if (!isAuthenticated) {
    console.log('Not authenticated!')
    return <Navigate to="/login" />;
  }
  console.log('Authenticated!')
  return <Outlet />;;
};

export default ProtectedRoute;
