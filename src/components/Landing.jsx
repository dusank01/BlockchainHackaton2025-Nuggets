// src/components/Landing.jsx
import { FaCertificate, FaLock, FaUserGraduate } from "react-icons/fa";
import { useEffect, useState } from "react";
import { isIssuer } from "../utils/roles";

const Landing = ({ onLogin }) => {

    const [account, setAccount] = useState(null);
  
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert("MetaMask nije instaliran!");
        return;
      }
      try {
        const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(selectedAccount);
        localStorage.setItem("walletAddress", selectedAccount)
        const role = isIssuer(selectedAccount) ? 'issuer' : 'earner';
        onLogin(selectedAccount, role);
      } catch (err) {
        console.error(err);
      }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero sekcija */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-blue-800 mb-6 leading-tight">
            Microcredential Platforma
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Decentralizovano rešenje za izdavanje, proveru i prikaz mikrokredencijala uz pomoć blockchain tehnologije.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
            onClick={connectWallet}
          >
            🔐 Prijavi se putem MetaMask-a
          </button>
        </div>

      </div>

      {/* Sekcija o projektu */}
      <div className="bg-white py-16 px-6 md:px-20 border-t">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Zašto Microcredential Platforma?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <FaUserGraduate className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Za studente</h3>
            <p className="text-gray-600">
              Pratite i prikažite vaše obrazovne veštine i kompetencije u obliku verifikovanih mikrokredencijala.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <FaCertificate className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Za institucije</h3>
            <p className="text-gray-600">
              Jednostavno izdavanje mikrokredencijala sa potpunom transparentnošću i sigurnošću.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <FaLock className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Bezbedna verifikacija</h3>
            <p className="text-gray-600">
              Blockchain omogućava nepromenljivost i proverljivost svakog kredencijala bez potrebe za posrednicima.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Microcredential Platforma — Sva prava zadržana.
      </footer>
    </div>
  );
};

export default Landing;
