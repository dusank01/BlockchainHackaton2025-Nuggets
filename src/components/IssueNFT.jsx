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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (credential) {
      setRequestId(credential.id);
      setForm({
        naziv: credential.credentialTitle || "",
        institucija: credential.institucija || "",
        izvor: credential.izvor || "",
        datum: credential.datum || "",
        ishodi: credential.competencies || "",
        preduslovi: credential.preduslovi || "",
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

      setShowModal(true);
      setModalMessage("🔄 Pokretanje transakcije...");

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCredentialFromRequest(requestId);

      setModalMessage("⏳ Čekanje potvrde transakcije...");
      await tx.wait();

      setModalMessage("✅ NFT mikrokredencijal uspešno izdat!");
      setTimeout(() => {
        setShowModal(false);
        onBack(true);
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.reason === "Vec izdato") {
        setModalMessage("⚠ Ovaj zahtev je već izdat.");
      } else {
        setModalMessage("❌ Greška: " + err.message);
      }
      setTimeout(() => {
        setShowModal(false);
        onBack(true);
      }, 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md relative">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="text-lg font-medium mb-4">{modalMessage}</p>
            <div className="flex justify-center">
              <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueNFT;
