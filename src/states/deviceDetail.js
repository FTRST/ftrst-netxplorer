import { useEffect } from "react";
import { atom, useAtom } from 'jotai';
import { desktopResizingAtom } from "./deviceDetailState";

export const useDeviceDetail = () => {
  const [deviceDetails, resizeDeskSpace] = useAtom(desktopResizingAtom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const type = width < 850 ? 'mobile' : 'desktop';

        // Create better responsive windows
        let appWidth = '';
        if (width >= 1920) {
          appWidth = '50em';
        } else if (width < 1920 && width > 1000) {
          appWidth = '40em';
        } else if (width < 1000 && width > 640) {
          appWidth = '30em';
        } else {
          appWidth = `${width * .9}px`;
        }
        
     resizeDeskSpace({
      width,
      height,
      type,
      appWidth,
      deskSpace: {
        width: width * 0.8,
        height: height * 0.8,
      }
     });
    }

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [resizeDeskSpace]);

  return deviceDetails;
};