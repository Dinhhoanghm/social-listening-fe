"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Tạo Context
const WindowSizeContext = createContext();

// Provider Component
export const WindowSizeProvider = ({ children }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!windowSize.width) {
    return null;
  }

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
};

// Custom hook để consume context
export const useWindowSize = () => {
  const context = useContext(WindowSizeContext);

  if (context === undefined) {
    throw new Error("useWindowSize must be used within a WindowSizeProvider");
  }

  return context;
};

export default WindowSizeProvider;
