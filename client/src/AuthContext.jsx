// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = 'http://localhost:8080';

  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  useEffect(() => {
    const checkAuthentication = async () => {
      if (token) {
        try {
          const response = await axios.get(`${apiUrl}/getuser`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error("Authentication Failed");
        }
      }
      setLoading(false);
    }
    checkAuthentication();
  }, [token, apiUrl]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      cookies.set('TOKEN', response.data.token, { path: '/' });
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  const logout = () => {
    cookies.remove('TOKEN', { path: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
