import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token is not expired
        if (decoded.exp * 1000 > Date.now()) {
           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
           fetchUser();
        } else {
           logout();
        }
      } catch (err) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
