import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedReports, setSavedReports] = useState(() => {
    const stored = localStorage.getItem("devlens_saved_reports");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("devlens_saved_reports", JSON.stringify(savedReports));
  }, [savedReports]);

  const saveReport = useCallback((report) => {
    setSavedReports((prev) => {
      const filtered = prev.filter((item) => item.username !== report.username);
      return [{ ...report, savedAt: new Date().toISOString() }, ...filtered];
    });
  }, []);

  const removeReport = useCallback((username) => {
    setSavedReports((prev) => prev.filter((item) => item.username !== username));
  }, []);

  const isSaved = useCallback(
    (username) => savedReports.some((item) => item.username === username),
    [savedReports],
  );
  const value = useMemo(
    () => ({ savedReports, saveReport, removeReport, isSaved }),
    [savedReports, saveReport, removeReport, isSaved],
  );

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);