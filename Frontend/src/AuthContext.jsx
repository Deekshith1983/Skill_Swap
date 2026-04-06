import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "./services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auto-login if token exists - validate token on app restart
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getCurrentUser()
        .then(res => {
          setUser(res.data.user || res.data);
          setIsLoggedIn(true);
        })
        .catch(() => {
          // Token is invalid or expired - clear it and redirect to landing
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setToken(null);
          setUser(null);
          setIsLoggedIn(false);
          // Redirect to landing page if trying to access protected route
          if (window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/";
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (name, email, password, mobile, college) => {
    try {
      const res = await registerUser({ name, email, password, mobile, college });
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn, 
      loading,
      login, 
      register, 
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
