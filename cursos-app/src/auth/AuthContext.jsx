import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]       = useState(localStorage.getItem('token'));
  const [userId, setUserId]     = useState(localStorage.getItem('userId'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const login = ({ token, id, username }) => {
    localStorage.setItem('token',    token);
    localStorage.setItem('userId',   id);
    localStorage.setItem('username', username);
    setToken(token);
    setUserId(id);
    setUsername(username);
  };

  const logout = () => {
    ['token', 'userId', 'username'].forEach(k => localStorage.removeItem(k));
    setToken(null);
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}