import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL;
    fetch(`${apiBase}/api/hello`)
      .then((r) => r.json())
      .then((data) => setMsg(data.message))
      .catch((err) => setMsg("Error: " + err.message));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>{msg}</h1>
      <p>API base: {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}

export default App;
