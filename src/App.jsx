import "./index.css";
import { useState } from "react";
import DashboardEarner from "./components/DashboardEarner";
import DashboardIssuer from "./components/DashboardIssuer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Landing from "./components/Landing";
import Login from "./components/Login"
import DashboardEarnerAvailable from "./components/DashboardEarnerAvailable";
import StudentCredentials from "./components/StudentCredential";
import DashboardEarnerSent from "./components/DashboardEarnerSent";
import DashboardIssuerIssued from "./components/DashboardIssuerIssued";
import DashboardIssuerPending from "./components/DashboardIssuerPending";



function App() {

  const [user, setUser] = useState(null);

  const handleLogin = (address, role) => {
    setUser({ address, role });
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login onLogin={handleLogin}/>}/>  
        </Routes> 
      </Router>
    );
  }

  return (
    
    <Router>
      <Navbar address={user.address} role={user.role} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/earner" element={<StudentCredentials address={user.address} />} />
        <Route path="/pending" element={<DashboardIssuerPending address={user.address} />} />
        <Route path="/available" element={<DashboardEarnerAvailable address={user.address} />} />
        <Route path="/issued" element={<DashboardIssuerIssued address={user.address} />} />
        <Route path="/sent" element={<DashboardEarnerSent address={user.address}/>}/>
      </Routes>
    </Router>

  );
}

export default App;

