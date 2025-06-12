import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CodeGenerator = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState("");
  const [jsonMetaInput, setJsonMetaInput] = useState("");
  const [jsonPostOutput, setJsonPostOutput] = useState("");
  const [jsonSkipOutput, setJsonSkipOutput] = useState([
      "accountNumber", "partyId", "externalRefNo", "counterParty", "contractRefNo", "branch", "currencyCode",
      "makerId", "makerDtStamp", "makerRemarks", "checkerId", "checkerDtStamp", "checkerRemarks",
      "branchCode", "brnCode", "brn", "arg", "information", "override", "overrideAuthLevelsReqd",
      "error", "type", "language", "requestId", "httpStatusCode", "id", "iD", "args", "keyId"
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  //let loopIndexCounter = 0;

  const handleOpenPopup = () => {
    setShowModal(true);
  }

  const handleClosePopup = () => {
    setShowModal(false);
    setJsonMetaInput("");
    setSelectedFile("");
  };

  const handleLoadPopup = () => {
    setShowModal(false);
    setSelectedFile("");
  };

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(jsonPostOutput);
      alert("✅ Copied to clipboard!");
    } catch (err) {
      alert("❌ Failed to copy");
    }
  };

  const handleGenerateMetaScript = async () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const metadata2 = generateArrayMetadataPaths(jsonData);
      var metadataText = "{\n" +Object.keys(metadata2).map(key => `"${key}": []`).join(',\n') + "\n}";
      alert("✅ MetaData generated!");
      setJsonMetaInput(metadataText);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  // const SKIP_KEYS = [
  //     "accountNumber", "partyId", "externalRefNo", "counterParty", "contractRefNo", "branch", "currencyCode",
  //     "makerId", "makerDtStamp", "makerRemarks", "checkerId", "checkerDtStamp", "checkerRemarks",
  //     "branchCode", "brnCode", "brn", "arg", "information", "override", "overrideAuthLevelsReqd",
  //     "error", "type", "language", "requestId", "httpStatusCode", "id", "iD", "args", "keyId"
  // ];

  // function getKeyPathString(path) {
  //   return path.join(".");
  // };

  // function getPrimaryKeysForPath(metadata, path) {
  //   return metadata[getKeyPathString(path)] || [];
  // };

  // function generateIndexVariable() {
  //   return `i${loopIndexCounter++}`;
  // };

  // function generateVariableName(path) {
  //   return path[path.length - 1];
  // };

  // function formatValue(value) {
  //   return JSON.stringify(value);
  // };

  // function generatePrimaryKeyCondition(itemVar, pk) {
  //   return Object.entries(pk)
  //     .map(([k, v]) => `${itemVar}.${k} == ${formatValue(v)}`)
  //     .join(" && ");
  // };

  // function generateAssertions(output, obj, varPrefix, indent) {
  //   for (const [key, value] of Object.entries(obj)) {
  //     if (SKIP_KEYS.has(key) || typeof value === "object") continue;
  //       output.push(`${indent}pm.expect(${varPrefix}.${key}).to.eql(${formatValue(value)});`);
  //   }
  // };

  // function processNode(output, node, metadata, path, parentVars, parentLoopIndex, parentIsArray) {
  //   const indentLevel = parentVars.length + 1;
  //   const indent = "    ".repeat(indentLevel);

  //   if (Array.isArray(node) && node.length > 0) {
  //     const varName = generateVariableName(path);
  //     const matchVar = `${varName}MatchCount`;
  //     const loopIndex = generateIndexVariable();
  //     const parentAccess = parentIsArray ? `${parentVars[parentVars.length - 1]}[${parentLoopIndex}]` : parentVars[parentVars.length - 1];
  //     const fullVar = `${parentAccess}.${varName}`;

  //     output.push(`${indent}var ${varName} = ${fullVar};`);
  //     output.push(`${indent}let ${matchVar} = 0;`);
  //     output.push(`${indent}for (var ${loopIndex} = 0; ${loopIndex} < ${varName}.length; ${loopIndex}++) {`);

  //     const pks = getPrimaryKeysForPath(metadata, path);
  //     const seenConditions = new Set();

  //     for (const item of node) {
  //       if (typeof item !== "object" || Array.isArray(item)) continue;

  //       const pk = Object.fromEntries(Object.entries(item).filter(([k]) => pks.includes(k)));
  //       if (Object.keys(pk).length === 0) continue;

  //       const condition = generatePrimaryKeyCondition(`${varName}[${loopIndex}]`, pk);
  //       if (seenConditions.has(condition)) continue;
  //       seenConditions.add(condition);

  //       output.push(`${indent}    if (${condition}) {`);
  //       generateAssertions(output, item, `${varName}[${loopIndex}]`, indent + "        ");
  //       for (const [k, v] of Object.entries(item)) {
  //         if (typeof v === "object") {
  //           processNode(output, v, metadata, [...path, k], [...parentVars, varName], loopIndex, true);
  //         }
  //       }
  //       output.push(`${indent}        ${matchVar}++;`);
  //       output.push(`${indent}    }`);
  //     }
  //     output.push(`${indent}}`);
  //     output.push(`${indent}pm.test("Match (${matchVar}).to.eql(${varName}.length) Matching?", () => {`);
  //     output.push(`${indent}    pm.expect(${matchVar}).to.eql(${varName}.length);`);
  //     output.push(`${indent}});`);
  //   } else if (typeof node === "object" && node !== null) {
  //       const varName = generateVariableName(path);
  //       const parentAccess = parentIsArray ? `${parentVars[parentVars.length - 1]}[${parentLoopIndex}]` : parentVars[parentVars.length - 1];
  //       const fullVar = `${parentAccess}.${varName}`;

  //       output.push(`${indent}var ${varName} = ${fullVar};`);
  //       generateAssertions(output, node, varName, indent);

  //       for (const [key, value] of Object.entries(node)) {
  //         if (typeof value === "object") {
  //           processNode(output, value, metadata, [...path, key], [...parentVars, varName], parentLoopIndex, false);
  //         }
  //       }
  //   }
  // };

  const handleGeneratePostScript = async () => {
    try {
      const inputJson = JSON.parse(jsonInput);
      const metadata = JSON.parse(jsonMetaInput); 
      // code to generate script using python call
      var apiData = {
        "jsonInput" : JSON.stringify(inputJson),
        "jsonMetaInput" : JSON.stringify(metadata)
      }
      const response = await fetch('http://127.0.0.1:5000/generateFromReact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const result = await response.text();

      // code to generate script using function
      // loopIndexCounter = 0;
      // const output = [];

      // for (const [topKey, topValue] of Object.entries(inputJson)) {
      //   if (Array.isArray(topValue) && topValue.length > 0) {
      //     const varName = topKey;
      //     const topIndex = generateIndexVariable();
      //     output.push(`var ${varName} = pm.response.json().${varName};`);
      //     output.push(`pm.expect(${varName}.length).to.eql(${topValue.length});`);
      //     output.push(`for (var ${topIndex} = 0; ${topIndex} < ${varName}.length; ${topIndex}++) {`);
      //     generateAssertions(output, topValue[0], `${varName}[${topIndex}]`, "    ");
      //     for (const [key, value] of Object.entries(topValue[0])) {
      //       if (typeof value === "object") {
      //         processNode(output, value, metadata, [topKey, key], [varName], topIndex, true);
      //       }
      //     }
      //     output.push("}");
      //   } else if (typeof topValue === "object" && topValue !== null) {
      //     const varName = topKey;
      //     output.push(`var ${varName} = pm.response.json().${varName};`);
      //     generateAssertions(output, topValue, varName, "");
      //     for (const [key, value] of Object.entries(topValue)) {
      //       if (typeof value === "object") {
      //         processNode(output, value, metadata, [topKey, key], [varName], "", false);
      //       }
      //     }
      //   } else {
      //     output.push(`pm.expect(pm.response.json().${topKey}).to.eql(${formatValue(topValue)});`);
      //   }
      // }

      alert("✅ Postman validation script generated!");
      setJsonPostOutput(result);
    } catch (err) {
      console.error("Failed to fetch metadata", err);
    }
  };

  const handleReset = async () => {
    try{
      var value ="";
      setJsonInput(value);
      setJsonMetaInput(value);
      setJsonPostOutput(value);
    }catch(e){
      alert(e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      alert("Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonMetaInput(JSON.stringify(parsed, null, 2)); // Pretty-print
      } catch (err) {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  function generateArrayMetadataPaths(obj, path = '') {
    let result = {};
      if (Array.isArray(obj)) {
        if (path) result[path] = [];
        obj.forEach(item => {
          const childResult = generateArrayMetadataPaths(item, path);
          Object.assign(result, childResult);
        });
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          const newPath = path ? `${path}.${key}` : key;
          const childResult = generateArrayMetadataPaths(obj[key], newPath);
          Object.assign(result, childResult);
        }
      }
      return result;
  }

  return (
    <div className="dashboard-home">
    <div className="editor-container">
      <h1 className="editor-title">🧰 JSON to Postman Script Generator</h1>

      <div className="flex-row">
        {/* Input JSON */}
        <div className="panel">
          <label>📥 Input JSON</label>
          <textarea
            rows={15}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your input JSON here..."
          />
          <div className="button-stack">
            <button onClick={handleGenerateMetaScript}>Generate Metadata</button>
            <button className="secondary" onClick={handleReset}>Clear the Data</button>
          </div>
        </div>

        {/* Metadata JSON */}
        <div className="panel">
          <label>🧠 Metadata JSON</label>
          <textarea
            rows={15}
            value={jsonMetaInput}
            onChange={(e) => setJsonMetaInput(e.target.value)}
            placeholder="Paste or generate metadata here..."
          />
          <div className="button-stack">
            <button onClick={handleGeneratePostScript}>Generate Postman Script</button>
            <button className="secondary" onClick={handleOpenPopup}>Upload Metadata / Skip Keys</button>
          </div>
        </div>

        {/* Postman Output */}
        <div className="panel">
          <label>📤 Postman Script Output</label>
          <textarea
            rows={15}
            value={jsonPostOutput}
            onChange={(e) => setJsonPostOutput(e.target.value)}
            placeholder="Generated Postman script will appear here..."
          />
          <div className="button-stack">
            <button onClick={handleCopyOutput}>Copy to Clipboard</button>
            <button className="secondary" onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
    {showModal && (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>🧾 Updata Metadata File / Skip Keys</h2>

          <label className="modal-label">Skip Keys</label>
          <textarea
            rows={5}
            value={jsonSkipOutput}
            onChange={(e) => setJsonSkipOutput(e.target.value)}
            placeholder="Enter keys to skip with , as value ..."
            className="modal-textarea"
          />

          <label className="modal-label">Select Metadata JSON File</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="modal-file"
          />

          <div className="modal-buttons">
            <button onClick={handleLoadPopup}>Upload</button>
            <button className="cancel-button" onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default CodeGenerator;
