// src/components/DashboardIssuerIssued.jsx
import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardIssuerIssued = ({ address }) => {
  const [issuedCredentials, setIssuedCredentials] = useState([]);

  const fetchIssued = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tokenIds = await contract.getCredentialsByIssuer(address);
      const credentials = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const data = await contract.getCredential(tokenId);
          const owner = await contract.ownerOf(tokenId);

          return {
            id: tokenId.toString(),
            earnerAddress: owner,
            credentialTitle: data.naziv,
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

      setIssuedCredentials(credentials);
    } catch (err) {
      console.error("Greška pri učitavanju izdatih mikrokredencijala:", err);
    }
  };

  useEffect(() => {
    fetchIssued();
  }, [address]);

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4">Izdate mikrokredencijale</h3>

      {issuedCredentials.length === 0 ? (
        <p className="text-gray-500">Još uvek niste izdali nijedan mikrokredencijal.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {issuedCredentials.map((cred) => (
            <div
              key={cred.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <h4 className="text-lg font-semibold">{cred.credentialTitle}</h4>
              <p className="text-sm">Izdato studentu: {cred.earnerAddress}</p>
              <p className="text-sm mt-2 font-medium">Kompetencije:</p>
              <ul className="text-sm list-disc list-inside">
                {cred.competencies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <p className="text-xs mt-2 italic text-gray-500">Trajanje: {cred.trajanje}</p>
              <p className="text-xs text-gray-500">Institucija: {cred.institucija}</p>
              <p className="text-xs text-gray-500">Datum: {cred.datum}</p>
              <p className="text-xs text-gray-500">Preduslovi: {cred.preduslovi}</p>
              <p className="text-xs text-gray-500">Dodatne informacije: {cred.dodatneInfo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerIssued;
