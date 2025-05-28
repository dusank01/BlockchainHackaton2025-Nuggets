import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardEarnerSent = ({ address }) => {
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchPendingRequests = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const totalRequests = await contract.requestCounter();
      const requests = [];

      for (let i = 0; i < totalRequests; i++) {
        const req = await contract.getRequest(i);
        if (req.earner.toLowerCase() === address.toLowerCase() && !req.isIssued) {
          requests.push({
            id: i.toString(),
            naziv: req.naziv,
            institucija: req.institucija,
            datum: req.datum,
            issuer: req.issuer,
          });
        }
      }

      setPendingRequests(requests);
    } catch (err) {
      console.error("Greška prilikom učitavanja zahteva:", err);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [address]);

  return (
    <div className="mt-10">
      <h3 className="text-xl mb-2">Poslati zahtevi na čekanju</h3>
      <ul className="list-disc list-inside text-sm">
        {pendingRequests.length === 0 ? (
          <li>Nemate zahteva koji su još uvek na čekanju.</li>
        ) : (
          pendingRequests.map((req) => (
            <li key={req.id}>
              {req.naziv}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DashboardEarnerSent;
