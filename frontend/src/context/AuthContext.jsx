import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kernia_user')); } catch { return null; }
  });

  const signIn = (tokenResponse) => {
    localStorage.setItem('kernia_token', tokenResponse.token);
    localStorage.setItem('kernia_user', JSON.stringify(tokenResponse));
    setUser(tokenResponse);
  };

  const signOut = () => {
    localStorage.removeItem('kernia_token');
    localStorage.removeItem('kernia_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
