import { createContext, useContext, useEffect, useState } from "react";

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedReports, setSavedReports] = useState(() => {
    const stored = localStorage.getItem("devlens_saved_reports");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("devlens_saved_reports", JSON.stringify(savedReports));
  }, [savedReports]);

  const saveReport = (report) => {
    setSavedReports((prev) => {
      const filtered = prev.filter((item) => item.username !== report.username);
      return [{ ...report, savedAt: new Date().toLocaleDateString() }, ...filtered];
    });
  };

  const removeReport = (username) => {
    setSavedReports((prev) => prev.filter((item) => item.username !== username));
  };

  const isSaved = (username) => savedReports.some((item) => item.username === username);

  return (
    <SavedContext.Provider value={{ savedReports, saveReport, removeReport, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);