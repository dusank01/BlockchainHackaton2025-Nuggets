// src/components/Login.jsx
import { useEffect, useState } from "react";
import { isIssuer } from "../utils/roles";

const Login = ({ onLogin }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask nije instaliran!");
      return;
    }
    try {
      const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(selectedAccount);
      const role = isIssuer(selectedAccount) ? 'issuer' : 'earner';
      onLogin(selectedAccount, role);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Prijavi se putem MetaMask-a</h1>
      <button 
        className="bg-blue-600 text-white px-6 py-2 rounded-xl"
        onClick={connectWallet}
      >
        Poveži novčanik
      </button>
    </div>
  );
};

export default Login;
