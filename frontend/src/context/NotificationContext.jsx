import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

// Explicit notification API. Nothing in the app calls this automatically —
// notifications fire only on real user actions or future backend events.
export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(({ type = "info", title, message }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev, { id, type, title, message }]);
    window.setTimeout(() => dismiss(id), 5000);
    return id;
  }, [dismiss]);

  return (
    <NotificationContext.Provider value={{ items, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}