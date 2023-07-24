import React from "react";
import "./App.css";

import { Ticker } from "./components/Ticker";

function App() {
  return (
    <div className="App">
      <h2>Realtime Crypto Currency Price</h2>
      <Ticker />
    </div>
  );
}

export default App;
