import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RequireAuth = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!auth.token && !showToast) {
      toast.warning("🔒 Accesso negato! Effettua il login per continuare.", { autoClose: 3000 });
      setShowToast(true);
    }
  }, [auth.token, showToast]);

  return auth.token ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
