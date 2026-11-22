import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loginUser } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("devlens_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (username) => {
    const data = await loginUser(username);
    setUser(data);
    localStorage.setItem("devlens_user", JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("devlens_user");
  }, []);
  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);