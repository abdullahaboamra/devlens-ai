import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("devlens_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    setUser(data);
    localStorage.setItem("devlens_user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("devlens_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);