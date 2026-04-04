import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "./services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const login = async (data) => {
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
    } catch {
      alert("Invalid credentials");
    }
  };

  const register = async (data) => {
    try {
      const res = await registerUser(data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
    } catch {
      alert("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};