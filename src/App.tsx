import { SDKProvider } from "@telegram-apps/sdk-react";
import "./App.css";
import { Qr } from "./qr";

function App() {
  return (
    <SDKProvider acceptCustomStyles debug>
      <Qr />
    </SDKProvider>
  );
}

export default App;
