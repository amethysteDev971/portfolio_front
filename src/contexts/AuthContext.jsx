import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const token = localStorage.getItem('jwt_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { token, refreshToken };
  });
  const [loading, setLoading] = useState(true);

  // Utilisez import.meta.env pour récupérer les variables d'environnement
  const API_URL = import.meta.env.VITE_API_URL;
  const API_USER = import.meta.env.VITE_API_USER;
  const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

  const autoLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/login_check`, {
        email: API_USER,
        password: API_PASSWORD,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token, refresh_token } = response.data;
      setAuthTokens({ token, refreshToken: refresh_token });
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('refresh_token', refresh_token);
    } catch (error) {
      console.error('Auto-login error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
