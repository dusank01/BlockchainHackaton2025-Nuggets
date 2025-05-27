// src/components/DashboardIssuer.jsx
import { useState, useEffect } from "react";
import IssueNFT from "./IssueNFT";



const DashboardIssuer = ({ address }) => {
const [currentView, setCurrentView] = useState("dashboard");
const [selectedCredential, setSelectedCredential] = useState(null);
const openIssueNFT = (credential) => {
  setSelectedCredential(credential);
  setCurrentView("issue");
};
const dummyRequests = [
  {
    id: 1,
    credentialTitle: "Osnove Web Programiranja",
    earnerAddress: "0xAbc123...7890",
    competencies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: 2,
    credentialTitle: "Blockchain Osnove",
    earnerAddress: "0xEf456...4321",
    competencies: ["Smart Contracts", "Solidity"],
  },
];
  const [requests, setRequests] = useState([]);
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    // Ovde bi došao poziv pametnom ugovoru da se učitaju zahtevi
    setRequests(dummyRequests);
  }, []);

  const handleIssue = (reqId) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    setIssued([...issued, req]);
    setRequests(requests.filter((r) => r.id !== reqId));
    setCurrentView("issue");

  };
  if (currentView === "issue" && requests) {
  return (
    <IssueNFT
      credential={requests}
      onBack={() => setCurrentView("home")}
    />
  );
}

  return (
    <div className="p-6">
      {currentView === "issue" && (
  <IssueNFT onIssueClick={openIssueNFT} />
)}

{currentView === "issue" && selectedCredential && (
  <IssueNFT credential={selectedCredential} onBack={() => setCurrentView("dashboard")} />
)}

      <h2 className="text-2xl font-bold mb-4">Dobrodošao, Issuer</h2>
      <p className="text-sm text-gray-600 mb-6">Wallet: {address}</p>

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
              <p className="text-sm mt-2 font-medium">Kompetencije:</p>
              <ul className="text-sm list-disc list-inside">
                {req.competencies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
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

export default DashboardIssuer;

