import { useState, useLayoutEffect } from "react";

const MOBILE_MAX_SIZE = 480;

const getIsMobile = () => window.innerWidth <= MOBILE_MAX_SIZE;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useLayoutEffect(() => {
    const windowListener = () => {
      if (getIsMobile()) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', windowListener);

    return () => {
      window.removeEventListener('resize', windowListener);
    }
  }, []);

  return isMobile;
};
