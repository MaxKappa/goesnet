import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null,
  });

  const fetchUser = async () => {
    if (!auth.token) return;
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setAuth((prev) => ({ ...prev, user: response.data }));
    } catch (error) {
      console.error("Errore nel recupero dell'utente:", error);
      logout();
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchUser();
    }
  }, [auth.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth({ token, user: null });
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
