import './App.css';
import NetXplorer from './components/NetXplorer';
import {ShortcutContainer} from 'futurist-components';

import { useSetAtom } from 'jotai';
import { useDeviceDetail } from './states/deviceDetail';
import { windowManipulatorAtom } from './states/deviceDetailState';

function App() {

  const device = useDeviceDetail();
  const manipulateWindows = useSetAtom(windowManipulatorAtom);
  
  const shortcuts = [
    {
      icon: 'https://futurist.io/icons/folder.png', 
      title: 'Net Xplorer', 
      id: "nxp",
      type: "app",
      windowData: {
        id: "nxp",
        title: "NetXplorer",
        width: "300px",
        height: "300px",
        xCoord: 10,
        yCoord: 10
      }
    }
  ];

  return (
    <>
      <ShortcutContainer device={device} shortcuts={shortcuts} manipulateWindows={manipulateWindows} />
      <NetXplorer device={device} manipulateWindows={manipulateWindows} />
    </>
  )
}

export default App