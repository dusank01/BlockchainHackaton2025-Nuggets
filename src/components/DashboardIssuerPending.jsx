// src/components/DashboardIssuerPending.jsx
import { useState, useEffect } from "react";
import IssueNFT from "./IssueNFT";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardIssuerPending = ({ address }) => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [requests, setRequests] = useState([]);
  const [issued, setIssued] = useState([]);

  const fetchRequests = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const ids = await contract.getRequestsByIssuer(address);
      const reqs = await Promise.all(
        ids.map(async (id) => {
          const data = await contract.getRequest(id);
          if (data.isIssued) return null; // ⚠️ filtriraj izdato odmah ovde

          return {
            id: id.toString(),
            credentialTitle: data.naziv,
            earnerAddress: data.earner,
            competencies: data.ishodi,
            dodatneInfo: data.dodatneInfo,
            institucija: data.institucija,
            izvor: data.izvor,
            datum: data.datum,
            preduslovi: data.preduslovi,
            trajanje: data.trajanje,
            tokenURI: data.tokenURI
          };
        })
      );

      // ukloni sve koji su null (izdati)
      setRequests(reqs.filter(r => r !== null));
    } catch (err) {
      console.error("Greška pri učitavanju zahteva:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [address]);

  const handleIssue = (reqId) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    setSelectedCredential(req);
    setCurrentView("issue");
  };

  const handleBack = (refresh) => {
    if (refresh && selectedCredential) {
      setIssued(prev => [...prev, selectedCredential]);
      setRequests(prev => prev.filter(r => r.id !== selectedCredential.id));
    }
    setCurrentView("dashboard");
    setSelectedCredential(null);
  };

  if (currentView === "issue" && selectedCredential) {
    return (
      <IssueNFT
        credential={selectedCredential}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl mb-2">Zahtevi za mikrokredencijale</h3>
      {requests.length === 0 ? (
        <p className="text-gray-500">Nema trenutno zahteva.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <h4 className="text-lg font-semibold">{req.credentialTitle}</h4>
              <p className="text-sm">Student: {req.earnerAddress}</p>
              <p className="text-sm mt-2 font-medium">Institucija:</p>
              <p className="text-sm">{req.institucija}</p>
              <p className="text-sm mt-2 font-medium">Izvor:</p>
              <p className="text-sm">{req.izvor}</p>
              <p className="text-sm mt-2 font-medium">Ishodi:</p>
              <p className="text-sm">{req.competencies}</p>
              <p className="text-sm mt-2 font-medium">Preduslovi:</p>
              <p className="text-sm">{req.preduslovi}</p>
              <p className="text-sm mt-2 font-medium">Dodatne informacije:</p>
              <p className="text-sm">{req.dodatneInfo}</p>
              <p className="text-sm mt-2 font-medium">Trajanje:</p>
              <p className="text-sm">{req.trajanje}</p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={() => handleIssue(req.id)}
              >
                Izdaj mikrokredencijal
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerPending;
