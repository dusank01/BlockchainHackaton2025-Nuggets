import { useState, useEffect } from "react";
import IssueNFT from "./IssueNFT";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardIssuerPending = ({ address }) => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [requests, setRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRequests = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const ids = await contract.getRequestsByIssuer(address);
      const reqs = await Promise.all(
        ids.map(async (id) => {
          const data = await contract.getRequest(id);
          if (data.isIssued) return null;
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
            tokenURI: data.tokenURI,
          };
        })
      );

      setRequests(reqs.filter((r) => r !== null));
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
      setRequests((prev) => prev.filter((r) => r.id !== selectedCredential.id));
    }
    setCurrentView("dashboard");
    setSelectedCredential(null);
  };

  if (currentView === "issue" && selectedCredential) {
    return <IssueNFT credential={selectedCredential} onBack={handleBack} />;
  }

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4 font-semibold text-blue-700">Zahtevi za mikrokredencijale</h3>
      {requests.length === 0 ? (
        <p className="text-gray-500">Nema trenutno zahteva.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded-xl shadow-sm bg-white relative flex flex-col"
            >
              <h4 className="text-lg font-semibold">{req.credentialTitle}</h4>
              <p className="text-sm text-gray-600">Student: {req.earnerAddress}</p>
              <p className="text-sm text-gray-600">Institucija: {req.institucija}</p>

              {expandedId === req.id && (
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p><strong>Izvor:</strong> {req.izvor}</p>
                  <p><strong>Ishodi:</strong> {req.competencies}</p>
                  <p><strong>Preduslovi:</strong> {req.preduslovi}</p>
                  <p><strong>Dodatne informacije:</strong> {req.dodatneInfo}</p>
                  <p><strong>Trajanje:</strong> {req.trajanje}</p>
                  <p><strong>Datum:</strong> {req.datum}</p>
                  <p className="break-all text-blue-600 text-xs"><strong>Token URI:</strong> {req.tokenURI}</p>
                </div>
              )}

              {/* Prikaži više dugme */}
              <button
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                className="text-blue-600 text-sm mt-3 self-start hover:underline"
              >
                {expandedId === req.id ? "Prikaži manje" : "Prikaži više"}
              </button>

              {/* Izdaj dugme u donjem desnom uglu */}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleIssue(req.id)}
                >
                  Izdaj mikrokredencijal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerPending;
