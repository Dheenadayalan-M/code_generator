import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Home.css';
import oracleLogo from "../img/oracle-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-home">
      <div className="overlay">
        <div className="card">
          <div className="logo-container">
            <h1 className="title">Welcome to Postman Script Generator</h1>
          </div>

          <h2 className="subtitle">📌 Points to Remember</h2>

          <ul className="instructions">
            <li>📄 Place the response JSON in the <strong>"Input JSON"</strong> text area.</li>
            <li>⚙️ Click the <strong>"Generate Metadata"</strong> button.</li>
            <li>🧠 Add the <strong>unique keys</strong> to the generated metadata.</li>
            <li>💡 Click the <strong>"Generate Postman Script"</strong> button.</li>
            <li>🚀 Paste the output into Postman's <strong>"Test"</strong> tab and verify.</li>
          </ul>

          <button className="navigate-btn" onClick={() => navigate("/CodeGenerator")}>
            Go to Code Generator
          </button>
          <br/>
          <div>
            <img src={oracleLogo} alt="Oracle Logo" className="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;