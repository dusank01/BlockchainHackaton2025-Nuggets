import "./index.css";

// src/App.jsx
import { useState } from "react";
import Login from "./components/Login";
import DashboardEarner from "./components/DashboardEarner";
import DashboardIssuer from "./components/DashboardIssuer";

function App() {
  
  const [user, setUser] = useState(null);

  const handleLogin = (address, role) => {
    setUser({ address, role });
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {user.role === 'earner' ? (
        <DashboardEarner address={user.address} />
      ) : (
        <DashboardIssuer address={user.address} />
      )}
    </div>
  );
}

export default App;

