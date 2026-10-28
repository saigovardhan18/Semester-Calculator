import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllSemesters, getActiveSemester } from '../db/semesters';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeSemester, setActiveSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const refreshSemesters = useCallback(async () => {
    try {
      const allSemesters = await getAllSemesters();
      setSemesters(allSemesters);
      const active = await getActiveSemester();
      setActiveSemester(active);
    } catch (error) {
      console.error('Failed to load semesters:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSemesters();
  }, [refreshSemesters]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      activeSemester,
      semesters,
      loading,
      toasts,
      refreshSemesters,
      addToast,
      removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
