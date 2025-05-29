// src/components/DashboardIssuerIssued.jsx
import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const DashboardIssuerIssued = ({ address }) => {
  const [issuedCredentials, setIssuedCredentials] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4 font-semibold text-blue-700">Izdati mikrokredencijali</h3>

      {issuedCredentials.length === 0 ? (
        <p className="text-gray-500">Još uvek niste izdali nijedan mikrokredencijal.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {issuedCredentials.map((cred,index) => (
            <div
              key={cred.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <h4 className="text-lg font-semibold">{cred.credentialTitle}</h4>
              <p className="text-sm">Izdato studentu: {cred.earnerAddress}</p>
              <br></br>
              <p className="text-xs text-gray-500">Datum: {cred.datum}</p>
              {expandedIndex === index && (
                <>
              <p className="text-xs text-gray-500">Institucija: {cred.institucija}</p>
              <p className="text-xs text-gray-500">Izvor: {cred.izvor}</p>
              <p className="text-xs text-gray-500">Ishodi: {cred.competencies}</p>
              <p className="text-xs text-gray-500">Preduslovi: {cred.preduslovi}</p>
              <p className="text-xs text-gray-500">Dodatne informacije: {cred.dodatneInfo}</p>
              <p className="text-xs text-gray-500">Trajanje: {cred.trajanje}</p>

                  <p className="text-sm text-blue-700 mt-2">
                    <strong>Token URI:</strong>{" "}
                    <a href={cred.uri} target="_blank" rel="noreferrer">{cred.uri}</a>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Token ID: {cred.tokenId}</p>
                </>
              )}
                <button
                onClick={() => toggleExpand(index)}
                className="mt-3 text-sm text-blue-600 underline hover:text-blue-800"
              >
                {expandedIndex === index ? "Prikaži manje" : "Prikaži više"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerIssued;
