// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VerificationModal from './VerificationModal';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, verification } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If authenticated but not verified, ensure modal is shown
    // This handles cases where user reloads page or comes back
    if (user && !user.isVerified && !verification.showModal) {
      // We'll handle this with a separate effect or component
    }
  }, [isAuthenticated, user, navigate, verification.showModal]);

  return (
    <>
      {children}
      <VerificationModal />
    </>
  );
};

export default ProtectedRoute;