import { use, useState } from "react";

const Login = ({ onLogin }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8000/api";


  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask nije instaliran!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Poveži MetaMask
      const [selectedAccount] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);

      // 2️⃣ Pozovi Laravel backend
      const response = await fetch(`${API_URL}/users/wallet/${selectedAccount}`);
      if (!response.ok) {
        throw new Error("Korisnik nije pronađen u bazi!");
      }

      const userData = await response.json();

      // 3️⃣ Normalizuj role
      const role = (userData.role || "earner").toLowerCase().trim();
      const userId = userData.id;

      console.log("ROLE IZ API-JA:", userData.role);
      console.log("ROLE POSLE NORMALIZACIJE:", role);

      // 4️⃣ Prosledi dalje App komponenti
      onLogin(selectedAccount, role,userId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Greška prilikom prijavljivanja");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Prijavi se putem MetaMask-a</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
        onClick={connectWallet}
      >
        {loading ? "Proveravam..." : "Poveži novčanik"}
      </button>

      {account && (
        <p className="text-gray-600 mt-4 text-sm">Povezan nalog: {account}</p>
      )}
    </div>
  );
};

export default Login;
