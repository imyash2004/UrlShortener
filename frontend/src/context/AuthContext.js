import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import organizationService from '../services/organizationService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const decodedToken = jwtDecode(currentUser.token);
      if (decodedToken.exp * 1000 > Date.now()) {
        setUser(currentUser);
      } else {
        authService.logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.signin(email, password);
      setUser(userData);
      
      // This part is tricky because setUser is async.
      // A better approach is to rely on the fact that authService.signin
      // has already set the item in localStorage.
      // The issue might be that authHeader() is called before the context updates.
      // Let's try a direct approach.
      
      const response = await organizationService.getUserOrganizations();
      console.log("Fetched organizations:", response);
      if (response && response.data && response.data.content && response.data.content.length > 0) {
        navigate('/dashboard');
      } else {
        navigate('/create-organization');
      }
      return userData;
    } catch (error) {
      console.error("Login failed in AuthContext", error);
      // If login fails, we should not proceed.
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const signup = (firstName, lastName, email, password) => {
    return authService.signup(firstName, lastName, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
