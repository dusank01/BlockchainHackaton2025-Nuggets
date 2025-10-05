import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";
import api from "../api";

const IssueNFT = ({ credential, onBack }) => {
  const [form, setForm] = useState({
    naziv: "",
    institucija: "",
    datum: "",
    ishodi: "",
    preduslovi: "",
    trajanje: "",
    tokenURI: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [blockchainRequestId, setBlockchainRequestId] = useState(null);

  // 🔹 Popuni formu podacima iz credential objekta
  useEffect(() => {
    console.log("📦 Credential primljen u IssueNFT:", credential);
    if (credential) {
      setBlockchainRequestId(credential.blockchain_request_id ?? null);

      setForm({
        naziv: credential.certificate?.name || "",
        institucija: credential.certificate?.organization?.name || "",
        datum: new Date().toISOString().slice(0, 10),
        ishodi: credential.certificate?.learning_outcomes || "",
        preduslovi: credential.certificate?.prerequisites || "",
        trajanje: credential.certificate?.duration || "",
        tokenURI:
          credential.certificate?.tokenURI||
          "",
      });
    }
  }, [credential]);


  // 🔹 Izdavanje NFT sertifikata
 const handleIssue = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask nije pronađen.");
    if (!form.tokenURI) throw new Error("Token URI nije definisan u zahtevu!");
    if (blockchainRequestId === null)
      throw new Error("Zahtev nije povezan sa blockchain request ID-jem!");

    setShowModal(true);
    setModalMessage("🔄 Pokretanje blockchain transakcije...");

    // 1️⃣ Povezivanje sa MetaMask-om
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    console.log("📤 Izdavanje sertifikata za request ID:", blockchainRequestId);

    // ✅ 2️⃣ Ažuriraj token_uri u bazi pre blockchain transakcije
    await api.put(`/requests/${credential.id}`, {
      token_uri: form.tokenURI,
    });

    // 3️⃣ Poziv pametnog ugovora
    const tx = await contract.issueCertificateFromRequest(blockchainRequestId);
    setModalMessage("⏳ Čekanje potvrde blockchain transakcije...");

    const receipt = await tx.wait();
    const txHash = receipt.hash;
    console.log("✅ Transakcija potvrđena:", txHash);

    // 4️⃣ Laravel backend — ažuriranje statusa i transakcije
    setModalMessage("📡 Ažuriranje baze podataka...");
    await api.put(`/requests/${credential.id}`, {
      status: "issued",
      blockchain_tx_hash: txHash,
      token_uri: form.tokenURI,
    });

    // 5️⃣ Kreiraj blockchain evidenciju
    await api.post("/blockchain-records", {
      user_id: credential.user?.id,
      certificate_id: credential.certificate?.id,
      issuer_address: await signer.getAddress(),
      earner_address: credential.user?.wallet_address,
      tx_hash: txHash,
      token_uri: form.tokenURI,
    });

    setModalMessage("✅ Sertifikat uspešno izdat i sinhronizovan!");
    setTimeout(() => {
      setShowModal(false);
      onBack(true);
    }, 2500);
  } catch (err) {
    console.error("❌ Greška pri izdavanju:", err);
    setModalMessage("⚠️ " + (err.reason || err.message));
    setTimeout(() => {
      setShowModal(false);
      onBack(false);
    }, 3000);
  }
};


  // === UI ===
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Izdavanje NFT Sertifikata
      </h2>

      {/* 📋 Forma sa podacima o sertifikatu */}
      <div className="space-y-4">
        {Object.entries(form).map(([key, val]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {key === "tokenURI"
                ? "Token URI (IPFS link)"
                : key === "ishodi"
                ? "Ishodi učenja"
                : key}
            </label>
            <input
              name={key}
              value={val}
              readOnly
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
        ))}
      </div>

      {/* Dugmad */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleIssue}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Izdaj sertifikat
        </button>
        <button
          onClick={() => onBack(false)}
          className="text-gray-600 underline text-sm"
        >
          Nazad
        </button>
      </div>

      {/* Modal statusa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="text-lg font-medium mb-4">{modalMessage}</p>
            <div className="flex justify-center">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                viewBox="0 0 24 24"
              >
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
