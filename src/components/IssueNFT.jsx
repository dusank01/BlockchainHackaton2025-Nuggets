import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const IssueNFT = ({ credential, onBack }) => {
  const [form, setForm] = useState({
    earner: "",
    naziv: "",
    institucija: "",
    izvor: "",
    datum: "",
    ishodi: "",
    preduslovi: "",
    dodatneInfo: "",
    trajanje: "",
    tokenURI: "",
  });

  const [status, setStatus] = useState("");
  useEffect(() => {
    if (credential) {
      setForm(prev => ({
        ...prev,
        earner: credential.earnerAddress || "",
        naziv: credential.naziv || credential.credentialTitle || "",
        institucija: credential.institucija || "",
        izvor: credential.izvor || "",
        datum: credential.datum || "",
        ishodi: credential.ishodi || (credential.competencies?.join(", ") || ""),
        preduslovi: credential.preduslovi || "",
        dodatneInfo: credential.dodatneInfo || "",
        trajanje: credential.trajanje || "",
        tokenURI: ""
      }));
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
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.issueCredential(
        form.earner,
        form.naziv,
        form.institucija,
        form.izvor,
        form.datum,
        form.ishodi,
        form.preduslovi,
        form.dodatneInfo,
        form.trajanje,
        form.tokenURI
      );

      setStatus("⏳ Čekam potvrdu...");
      await tx.wait();
      setStatus("✅ NFT mikrokredencijal izdat!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Greška: Nepravilno uneti podaci");
    }
  };

return (
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Izdavanje NFT Mikrokredencijala</h2>

    <div className="space-y-4">
      {Object.entries(form).map(([key, val]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {key}
          </label>
          <input
            name={key}
            value={val}
            onChange={handleChange}
            placeholder={`Unesi ${key}`}
            className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>

    <button
      onClick={handleIssue}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
    >
      Izdaj NFT
    </button>

    {status && (
      <p className="mt-4 text-sm text-gray-700 italic">{status}</p>
    )}
  </div>
);

};

export default IssueNFT;
