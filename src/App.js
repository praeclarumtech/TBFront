// import logo from "./logo.svg";
// import "./App.css";
// import PassingYearForm from "./PassingYearFrom";
// // import Admin_filter from "./Admin_filter";
// import Model from "./Model";
// import Add_skill from "./Add_skill";
// import TestBt from "./TestBt";
// import ModelAdd_skill from "./ModelAdd_skill";
// import PassingYear from "../src/data/code/PassingYear";
// import React from "react";
// import reactDOM from 'react-dom'
// import { BrowserRouter } from "react-router-dom";

// function App() {
//   return (
//     <div className="App">
//       {/* <Add_skill /> */}
//       {/* <Admin_filter /> */}
//       {/* <TestBt /> */}
//       <Model />
//       {/* <ModelAdd_skill /> */}
//       {/* <PassingYear /> */}
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateYear from "./data/code/PassingYear";
// import SomeOtherComponent from "./SomeOtherComponent";

function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateYear />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
