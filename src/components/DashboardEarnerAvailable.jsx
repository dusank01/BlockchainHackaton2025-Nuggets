import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";
import api from "../api";

const DashboardEarnerAvailable = ({ address, userId }) => {
  const [certificates, setCertificates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // 🔹 Učitaj sve sertifikate iz baze
  useEffect(() => {
    api
      .get("/certificates")
      .then((res) => {
        console.log("📄 Sertifikati:", res.data);
        setCertificates(res.data);
      })
      .catch((err) => console.error("❌ Greška pri učitavanju sertifikata:", err));
  }, []);

  // ✅ Glavna funkcija — slanje zahteva
  const handleRequest = async (certificateId) => {
    if (requests.includes(certificateId)) {
      setModalMessage("⚠ Već ste poslali zahtev za ovaj sertifikat.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      return;
    }

    setModalMessage("🔄 Slanje zahteva...");
    setIsLoading(true);
    setShowModal(true);

    try {
      // === 1️⃣ Pronađi sertifikat
      const cert = certificates.find((c) => c.id === certificateId);
      if (!cert) throw new Error("Sertifikat nije pronađen u lokalnoj listi.");

      // === 2️⃣ Uveri se da tokenURI postoji
      const tokenURI = cert.tokenURI || cert.token_uri || "";
      if (!tokenURI) throw new Error("Sertifikat nema definisan tokenURI!");

      // === 3️⃣ Poveži se sa MetaMask
      if (!window.ethereum) throw new Error("MetaMask nije pronađen.");
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // === 4️⃣ Pošalji zahtev na blockchain
      console.log("📤 Slanje requestCertificate sa tokenURI:", tokenURI);
      const tx = await contract.requestCertificate(
        parseInt(cert.organization?.id || 1),
        cert.name,
        cert.learning_outcomes || "",
        cert.prerequisites || "",
        cert.duration || "",
        tokenURI
      );

      console.log("⏳ Tx hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("✅ Transakcija potvrđena:", receipt);

      // === 5️⃣ Dohvati novi blockchain ID
      const total = await contract.requestCounter();
      const blockchainRequestId = Number(total) - 1;
      console.log("🆔 Novi blockchainRequestId:", blockchainRequestId);

      // === 6️⃣ Kreiraj zapis u bazi (sa blockchain ID i tokenURI)
      const backendRes = await api.post("/requests", {
        certificate_id: certificateId,
        user_id: userId,
        blockchain_request_id: blockchainRequestId,
        token_uri: tokenURI, // 🔥 Dodato ovde
      });
      console.log("✅ Backend zahtev sačuvan:", backendRes.data);

      setRequests([...requests, certificateId]);
      setModalMessage("✅ Zahtev uspešno poslat (backend + blockchain)!");

    } catch (error) {
      console.error("❌ Greška prilikom slanja:", error);
      setModalMessage("⚠️ " + (error.reason || error.message));
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowModal(false), 2500);
    }
  };

  // 🔹 Modal i UI deo
  const openDetailsModal = (cert) => setSelectedCertificate(cert);
  const closeDetailsModal = () => setSelectedCertificate(null);

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4 bg-white inline-block font-bold">
        Dostupni sertifikati
      </h3>

      <div className="flex flex-wrap gap-4">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white shadow-md rounded-xl p-4 w-72 border border-gray-200"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {cert.name}
              </h4>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Institucija:</strong>{" "}
                {cert.organization?.name || "Nepoznato"}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                <strong>Trajanje:</strong> {cert.duration || "N/A"}
              </p>

              <button
                className="text-blue-600 text-sm underline mb-3 inline-block"
                onClick={() => openDetailsModal(cert)}
              >
                Prikaži više
              </button>

              <button
                onClick={() => handleRequest(cert.id)}
                disabled={requests.includes(cert.id)}
                className={`w-full py-2 rounded-lg text-white ${
                  requests.includes(cert.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {requests.includes(cert.id)
                  ? "Zahtev poslat"
                  : "Pošalji zahtev"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-700">Nema dostupnih sertifikata.</p>
        )}
      </div>

      {/* Modal za status */}
      {showModal && !selectedCertificate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="text-lg font-medium mb-4">{modalMessage}</p>
            {isLoading && (
              <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse mx-auto" />
            )}
          </div>
        </div>
      )}

      {/* Modal sa detaljima sertifikata */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
            <h3 className="text-lg font-semibold mb-3">
              {selectedCertificate.name}
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Ishodi učenja:</strong>
              <br />
              {selectedCertificate.learning_outcomes ||
                "Nema definisanih ishoda učenja."}
            </p>
            <p className="text-gray-700 text-sm mb-4">
              <strong>Preduslovi:</strong>
              <br />
              {selectedCertificate.prerequisites ||
                "Nema navedenih preduslova."}
            </p>
            <button
              onClick={closeDetailsModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEarnerAvailable;
