import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'
import {DataProvider} from './GlobalState.'
import Header from "./components/headers/Header";
import Mainpages from "./components/mainpages/Pages";

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <Mainpages />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
