/*import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const MicroCredentialCard = ({ credential }) => {
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleRequest = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask nije pronađen");

      setStatus("⏳ Slanje zahteva na blockchain...");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // ⚙️ Priprema parametara
      const issuerAddress = credential.issuerAddress || credential.issuer; // možeš nazvati property kako želiš
      const organizationId = parseInt(credential.organizationId || 1); // privremeno 1 ako nema
      const name = credential.title || credential.naziv;
      const learningOutcomes = credential.competencies || credential.ishodi || "";
      const prerequisites = credential.preconditions || credential.preduslovi || "";
      const duration = credential.duration || "";
      const tokenURI = credential.tokenURI || "";
      console.log("Network:", await provider.getNetwork());
  console.log("Contract address:", CONTRACT_ADDRESS);
console.log("Signer:", await signer.getAddress());
console.log("Function exists:", typeof contract.requestCertificate);


      console.log("📤 Slanje transakcije...");
      const tx = await contract.requestCertificate(
        issuerAddress,
        organizationId,
        name,
        learningOutcomes,
        prerequisites,
        duration,
        tokenURI
      );

      console.log("⏳ Tx hash:", tx.hash);
      await tx.wait();
      console.log("✅ Transakcija potvrđena!");
      setStatus("✅ Zahtev uspešno poslat na blockchain!");
    } catch (err) {
      console.error("❌ Greška:", err);
      setStatus("❌ Greška: " + (err.reason || err.message));
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-4 w-full md:w-[300px] flex flex-col justify-between bg-white">
      <div>
        <h3 className="text-lg font-semibold">{credential.title}</h3>
        <p className="text-xs text-gray-500">
          <strong>Institucija:</strong> {credential.institution}
        </p>
        <p className="text-xs text-gray-500">
          <strong>Trajanje:</strong> {credential.duration}
        </p>

        {expanded && (
          <>
            <p className="text-xs text-gray-500">
              <strong>Ishodi:</strong> {credential.competencies}
            </p>
            <p className="text-xs text-gray-500">
              <strong>Preduslovi:</strong> {credential.preconditions}
            </p>
            <p className="text-xs text-gray-500">
              <strong>Token URI:</strong> {credential.tokenURI}
            </p>
          </>
        )}

        <button
          onClick={toggleExpand}
          className="mt-3 text-sm text-blue-600 underline hover:text-blue-800"
        >
          {expanded ? "Prikaži manje" : "Prikaži više"}
        </button>
      </div>

      <div className="flex justify-end items-end mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleRequest}
        >
          Pošalji zahtev
        </button>
      </div>

      {status && <p className="text-sm text-gray-600 mt-2 italic">{status}</p>}
    </div>
  );
};

export default MicroCredentialCard;*/
