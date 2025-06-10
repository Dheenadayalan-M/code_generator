import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CodeGenerator from "./pages/CodeGenerator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/CodeGenerator" element={<CodeGenerator />} />
    </Routes>
  );
}

export default App;