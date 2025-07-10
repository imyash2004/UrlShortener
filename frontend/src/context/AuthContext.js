import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import organizationService from "../services/organizationService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.token) {
          const decodedToken = jwtDecode(currentUser.token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser(currentUser);
          } else {
            // Token expired, clear it
            authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.signin(email, password);
      setUser(userData);

      // Always navigate to dashboard first
      navigate("/dashboard");

      // The dashboard will handle checking for organizations and showing the modal if needed
      return userData;
    } catch (error) {
      console.error("Login failed in AuthContext", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await authService.signup(
        firstName,
        lastName,
        email,
        password
      );
      // The backend always returns 200, so check response.data.success
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        // Business logic error (e.g., email already exists)
        return {
          success: false,
          message: response.data?.message || "Failed to create account.",
        };
      }
    } catch (error) {
      // Network or unexpected error
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create account.",
      };
    }
  };

  // Don't render children until auth is initialized
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
