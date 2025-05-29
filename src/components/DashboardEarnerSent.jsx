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
      <h3 className="text-xl mb-4 font-semibold text-blue-700">Poslati zahtevi na čekanju</h3>

      {pendingRequests.length === 0 ? (
        <p className="text-sm text-blue-700">Nemate zahteva koji su još uvek na čekanju.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-blue-50 text-gray-700 text-left text-sm">
              <tr>
                <th className="px-4 py-2 border-b">Naziv</th>
                <th className="px-4 py-2 border-b">Institucija</th>
                <th className="px-4 py-2 border-b">Datum</th>
                <th className="px-4 py-2 border-b">Issuer</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{req.naziv}</td>
                  <td className="px-4 py-2 border-b">{req.institucija}</td>
                  <td className="px-4 py-2 border-b">{req.datum}</td>
                  <td className="px-4 py-2 border-b text-xs break-all">{req.issuer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardEarnerSent;
