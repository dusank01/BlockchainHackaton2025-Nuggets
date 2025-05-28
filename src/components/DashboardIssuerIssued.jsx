// src/components/DashboardIssuer.jsx
import { useState, useEffect } from "react";
import IssueNFT from "./IssueNFT";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardIssuerIssued = ({ address }) => {
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
          return {
            id: id.toString(),
            credentialTitle: data.naziv,
            earnerAddress: data.earner,
            competencies: data.ishodi.split(", "),
            dodatneInfo: data.dodatneInfo,
            institucija: data.institucija,
            izvor: data.izvor,
            datum: data.datum,
            preduslovi: data.preduslovi,
            trajanje: data.trajanje
          };
        })
      );

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

      <div className="mt-10">
        <h3 className="text-xl mb-2">Izdate mikrokredencijale</h3>
        <ul className="list-disc list-inside text-sm">
          {issued.length === 0 ? (
            <li>Još uvek niste izdali nijedan mikrokredencijal.</li>
          ) : (
            issued.map((req) => (
              <li key={req.id}>
                {req.credentialTitle} → {req.earnerAddress}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardIssuerIssued;
