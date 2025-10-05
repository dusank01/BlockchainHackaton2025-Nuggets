import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./components/Login"; // 👈 dodaj Login
import DashboardEarnerAvailable from "./components/DashboardEarnerAvailable";
import DashboardEarnerSent from "./components/DashboardEarnerSent";
import DashboardIssuerIssued from "./components/DashboardIssuerIssued";
import DashboardIssuerPending from "./components/DashboardIssuerPending";
import LoggedIn from "./components/LoggedIn";
import DashboardEarnerIssued from "./components/DashboardEarnerIssued";
import { id } from "ethers";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (address, role, id) => {
    console.log("✅ Logged in:", address, role, id);
    setUser({ address, role, id});
  };

  if (!user) {
    return <Login onLogin={handleLogin} />; // 👈 koristi Login komponentu
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-hero-bg bg-cover bg-center opacity-50 z-0" />
      <div className="relative z-10">
        <Router>
          <Navbar address={user.address} role={user.role} />

          {/* 👇 ovde biramo dashboard po ulozi */}
          {user.role?.toLowerCase() === "issuer" ? (
            <Routes>
              <Route path="/" element={<DashboardIssuerIssued address={user.address} />} />
              <Route path="/pending" element={<DashboardIssuerPending userId={user.id} address={user.address} />} />
              <Route path="/issued" element={<DashboardIssuerIssued address={user.address} />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LoggedIn />} />
              <Route path="/available" element={<DashboardEarnerAvailable address={user.address} userId={user.id} />} />
              <Route path="/sent" element={<DashboardEarnerSent userId={user.id} />} />
              <Route path="/dashboard/earner/:address" element={<DashboardEarnerIssued userId={user.id} address={user.address} />} />
            </Routes>
          )}
        </Router>
      </div>
    </div>
  );
}

export default App;
