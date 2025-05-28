import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const MicroCredentialCard = ({ credential }) => {
  const [status, setStatus] = useState("");

  const handleRequest = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask nije pronađen");

      setStatus("⏳ Slanje zahteva...");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const issuerAddress = credential.issuer; // pretpostavljamo da credential sadrži issuer adresu
      const datum = new Date().toISOString().slice(0, 10); // današnji datum

      const tx = await contract.requestCredential(
        issuerAddress,
        credential.title,
        credential.institution,
        credential.source,
        datum,
        credential.competencies,
        credential.preconditions,
        credential.description,
        credential.duration,
        credential.tokenURI
      );

      await tx.wait();
      setStatus("✅ Zahtev uspešno poslat!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Greška: " + err.message);
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-4 w-full md:w-[300px]">
      <h3 className="text-lg font-semibold">{credential.title}</h3>
<br></br>
            <p className="text-xs text-gray-500"><strong>Institucija:</strong> {credential.institution}</p>
              <p className="text-xs text-gray-500"><strong>Izvor:</strong> {credential.source}</p>
              <p className="text-xs text-gray-500"><strong>Datum: </strong>{credential.datum}</p>
              <p className="text-xs text-gray-500"><strong>Ishodi: </strong>{credential.competencies}</p>
              <p className="text-xs text-gray-500"><strong>Preduslovi:</strong> {credential.preconditions}</p>
              <p className="text-xs text-gray-500"><strong>Dodatne informacije:</strong> {credential.description}</p>
              <p className="text-xs text-gray-500"><strong>Trajanje:</strong> {credential.duration}</p>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={handleRequest}
      >
        Pošalji zahtev
      </button>
      {status && (
        <p className="text-sm text-gray-600 mt-2 italic">{status}</p>
      )}
    </div>
  );
};

export default MicroCredentialCard;
