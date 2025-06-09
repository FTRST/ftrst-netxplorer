import { atom } from "jotai";

export const deviceDetailAtom = atom({
  width: 0,
  height: 0,
  type: "",
  appWidth: "",
  deskSpace: {
    width: 0,
    height: 0,
  },
  windows: [],
});

export const getWindowAtom = (id) =>
  atom(
    (get) => get(deviceDetailAtom).windows.find((w) => w.id === id),
    (get, set, newProps) => {
      const prevState = get(deviceDetailAtom);
      const updatedWindows = prevState.windows.map((w) =>
        w.id === id ? { ...w, ...newProps } : w,
      );
      set(deviceDetailAtom, { ...prevState, windows: updatedWindows });
    },
  );

export const desktopResizingAtom = atom(
  (get) => get(deviceDetailAtom),
  (get, set, updatedValues) => {
    set(deviceDetailAtom, (prev) => ({
      ...prev,
      ...updatedValues,
      deskspace: {
        ...prev.deskSpace,
        ...updatedValues.deskSpace,
      },
    }));
  },
);

export const windowManipulatorAtom = atom(
  (get) => get(deviceDetailAtom),
  (get, set, { type, window }) => {
    set(deviceDetailAtom, (prev) => {
      let newWindows = [...prev.windows];
      switch (type) {
        case "add":
          newWindows.push(window);
          break;
        case "remove":
          newWindows = newWindows.filter((w) => w.id !== window.id);
          break;
        case "update":
          newWindows = newWindows.map((w) =>
            w.id === window.id ? { ...w, ...window.props } : w,
          );
          break;
        case "reindex":
          const maxZIndex = 99999;
          const windowIndex = newWindows.findIndex((w) => w.id === window.id);
          if (windowIndex > -1) {
            const updatedWindow = {
              ...newWindows[windowIndex],
              zIndex: maxZIndex,
            };
            newWindows[windowIndex] = updatedWindow;
            newWindows = newWindows.map((w, index) => {
              if (index !== windowIndex) {
                return { ...w, zIndex: maxZIndex - (index + 1) };
              }
              return w;
            });
          }
          break;
        default:
          break;
      }
      return { ...prev, windows: newWindows };
    });
  },
);
