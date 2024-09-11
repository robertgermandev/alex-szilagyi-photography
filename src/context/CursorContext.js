import React, { useState, useEffect, createContext } from "react";

export const CursorContext = createContext();

const CursorProvider = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  const [cursorBg, setCursorBg] = useState("default");

  const mobileViewportIsActive = window.innerWidth < 768;

  useEffect(() => {
    if (!mobileViewportIsActive) {
      const move = (e) => {
        setCursorPosition({
          x: e.clientX,
          y: e.clientY,
        });
      };
      window.addEventListener("mousemove", move);

      return () => {
        window.removeEventListener("mousemove", move);
      };
    } else {
      setCursorBg("none");
    }
  }, []);

  const cursorVariants = {
    default: {
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
      backgroundColor: "#0e1112",
    },
    text: {
      width: "150px",
      height: "150px",
      x: cursorPosition.x - 72,
      y: cursorPosition.y - 72,
      backgroundColor: "#fff",
      mixBlendMode: "difference",
    },
    none: {
      width: 0,
      height: 0,
      backgroundColor: "rgba(255,255,255, 1)",
    },
  };

  const mouseEnterHandler = () => {
    setCursorBg("text");
  };

  const mouseLeaveHandler = () => {
    setCursorBg("default");
  };

  return (
    <CursorContext.Provider
      value={{ cursorVariants, cursorBg, mouseEnterHandler, mouseLeaveHandler }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export default CursorProvider;
