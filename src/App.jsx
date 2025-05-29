import "./index.css";
import { useState } from "react";
import { useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Landing from "./components/Landing";
import DashboardEarnerAvailable from "./components/DashboardEarnerAvailable";
import StudentCredentials from "./components/StudentCredential";
import DashboardEarnerSent from "./components/DashboardEarnerSent";
import DashboardIssuerIssued from "./components/DashboardIssuerIssued";
import DashboardIssuerPending from "./components/DashboardIssuerPending"
import LoggedIn from "./components/LoggedIn";





function App() {

  const [user, setUser] = useState(null);

  const handleLogin = (address, role) => {
    setUser({ address, role });
  };


  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing onLogin={handleLogin}/>}/> 
        </Routes> 
      </Router>
    );
  }

  return (
    

    <div className="relative min-h-screen">
      
    <div className="absolute inset-0 bg-hero-bg bg-cover bg-center opacity-50 z-0" />

      
      <div className="relative z-10">
    <Router>
      <Navbar address={user.address} role={user.role} />
      <Routes>
        <Route path="/" element={<LoggedIn/>} />
        <Route path="/dashboard/earner/:adress" element={<StudentCredentials address={user.address} />} />
        <Route path="/pending" element={<DashboardIssuerPending address={user.address} />} />
        <Route path="/available" element={<DashboardEarnerAvailable address={user.address} />} />
        <Route path="/issued" element={<DashboardIssuerIssued address={user.address} />} />
        <Route path="/sent" element={<DashboardEarnerSent address={user.address}/>}/>
      </Routes>
    </Router>
      </div>
    </div>
  );
}

export default App;

