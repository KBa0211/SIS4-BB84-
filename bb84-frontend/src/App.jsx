import { useState } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [numPhotons, setNumPhotons] = useState(1000);
  const [enableEve, setEnableEve] = useState(false);
  const [errorCheckPercent, setErrorCheckPercent] = useState(15);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:3000/api/simulate-bb84", {
        numPhotons,
        enableEve,
        errorCheckPercent,
      });

      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Ошибка подключения к backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🔐 BB84 Quantum Simulator</h1>

      <div className="form">
        <input
          type="number"
          value={numPhotons}
          onChange={(e) => setNumPhotons(+e.target.value)}
          placeholder="Photons"
        />

        <select
          value={enableEve}
          onChange={(e) => setEnableEve(e.target.value === "true")}
        >
          <option value="false">No Eve (secure)</option>
          <option value="true">Eve enabled (attack)</option>
        </select>

        <input
          type="number"
          value={errorCheckPercent}
          onChange={(e) => setErrorCheckPercent(+e.target.value)}
          placeholder="Error check %"
        />

        <button onClick={runSimulation}>
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </div>

      {result && (
        <div className="result">
          <h2>Result</h2>

          <p>
            <span className="label">Error rate:</span>{" "}
            <span className="value">{result.errorRate.toFixed(2)}%</span>
          </p>

          <p>
            <span className="label">Status:</span>{" "}
            <span className={result.isCompromised ? "danger" : "safe"}>
              {result.isCompromised ? "Compromised" : "Secure"}
            </span>
          </p>

          <p>
            <span className="label">Sifted key:</span>{" "}
            {result.aliceSiftedKey.length}
          </p>
          <p>
            <span className="label">Final key length:</span>{" "}
            {result.finalKey.length}
          </p>

          <div className="key">
            {result.finalKey.length
              ? result.finalKey.join("")
              : "No key generated"}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
