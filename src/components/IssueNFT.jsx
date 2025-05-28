// src/components/IssueNFT.jsx
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const IssueNFT = ({ credential, onBack }) => {
  const [form, setForm] = useState({
    naziv: "",
    institucija: "",
    izvor: "",
    datum: "",
    ishodi: "",
    preduslovi: "",
    dodatneInfo: "",
    trajanje: "",
    tokenURI: ""
  });

  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (credential) {
      setRequestId(credential.id);
      setForm({
        naziv: credential.credentialTitle || "",
        institucija: credential.institucija || "",
        izvor: credential.izvor || "",
        datum: credential.datum || "",
        ishodi: credential.competencies || "",
        preduslovi:credential.preduslovi || "",
        dodatneInfo: credential.dodatneInfo || "",
        trajanje: credential.trajanje || "",
        tokenURI: credential.tokenURI || ""
      });
    }
  }, [credential]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssue = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask nije pronađen");

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCredentialFromRequest(
        requestId
      );

      setStatus("⏳ Čekam potvrdu...");
      await tx.wait();
      setStatus("✅ NFT mikrokredencijal izdat!");
      onBack(true);
    } catch (err) {
      console.error(err);
      if (err.reason === "Vec izdato") {
        setStatus("⚠ Ovaj zahtev je već izdat.");
        onBack(true);
      } else {
        setStatus("❌ Greška: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Izdavanje NFT Mikrokredencijala</h2>

      <div className="space-y-4">
        {Object.entries(form).map(([key, val]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key === "tokenURI"
                ? "Token URI"
                : key === "dodatneInfo"
                ? "Dodatne informacije (opciono)"
                : key}
            </label>
            <input
              name={key}
              value={val}
              onChange={handleChange}
              placeholder={`Unesi ${key}`}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={!(key === "dodatneInfo")}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleIssue}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Izdaj NFT
        </button>
        <button
          onClick={() => onBack(false)}
          className="text-gray-600 underline text-sm"
        >
          Nazad
        </button>
      </div>

      {status && (
        <p className="mt-4 text-sm text-gray-700 italic">{status}</p>
      )}
    </div>
  );
};

export default IssueNFT;
