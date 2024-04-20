import { useEffect, useState } from "react";
import {
  MAX_WIDTH_BREAKPOINT,
  MAX_HEIGHT_BREAKPOINT,
} from "@src/app/Breakpoints";
import { LOCAL_STORAGE_KEYS } from "@src/app/Strings";

export const useIsMobile = () => {
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(width <= MAX_WIDTH_BREAKPOINT);

  useEffect(() => {
    setIsMobile(width <= MAX_WIDTH_BREAKPOINT);
  }, [width]);

  return isMobile;
};

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth !== windowDimensions.width) {
        const { width, height } = getWindowDimensions();
        setWindowDimensions({ width, height });
      }

      // Set maxHeight in Local Storage to fix issues with Android Viewport changing with
      // keyboard opening and closing
      const maxHeight = parseInt(
        localStorage.getItem(LOCAL_STORAGE_KEYS.MAX_HEIGHT)
      );
      if (window.innerHeight > maxHeight || isNaN(maxHeight)) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.MAX_HEIGHT,
          JSON.stringify(window.innerHeight)
        );
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowDimensions.width]);

  return windowDimensions;
}

function getWindowDimensions() {
  let { innerWidth: width, innerHeight: height } = window;

  // Force a smaller app view. See `Breakpoints.js` for more info.
  width = Math.min(width, MAX_WIDTH_BREAKPOINT);
  height = Math.min(height, MAX_HEIGHT_BREAKPOINT);

  return {
    width,
    height,
  };
}
