import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
  const res = await fetch('/shortlinks/api/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log('[UserContext] /me data:', data);
          setUser(data.user);
        } else {
          console.log('[UserContext] /me error');
          setUser(null);
        }
      } catch (err) {
        console.log('[UserContext] /me catch:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function logout() {
    try {
  await fetch('/shortlinks/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    setUser(null);
    window.location.href = '/';
  }
  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
