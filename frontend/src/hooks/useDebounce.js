import { useState, useEffect } from "react";

// Delays reflecting a rapidly changing value (e.g. search input) until the
// user pauses typing, avoiding an API request on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}