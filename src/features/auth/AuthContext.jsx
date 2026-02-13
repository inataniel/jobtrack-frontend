import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "./token";
import { login as loginApi } from "./api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    const user = await loginApi(email, password);
    const storedToken = getToken();
    setTokenState(storedToken);
    setIsAuthenticated(true);
    return user;
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
