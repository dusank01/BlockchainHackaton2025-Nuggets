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
        credential.institution || "Fakultet",
        "formalan",
        datum,
        credential.competencies.join(", "),
        "",
        credential.description,
        credential.duration || "1 mesec"
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
      <p className="text-sm mt-2">{credential.description}</p>
      <ul className="mt-2 text-xs list-disc list-inside">
        {credential.competencies.map((comp, idx) => (
          <li key={idx}>{comp}</li>
        ))}
      </ul>
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
