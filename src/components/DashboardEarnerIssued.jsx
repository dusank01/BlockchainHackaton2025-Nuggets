import { useState, useEffect } from "react";
import api from "../api";

// 🔹 Funkcija za čitanje slike iz tokenURI metapodataka
const fetchImageFromTokenURI = async (uri) => {
  try {
    if (!uri) return null;
    const res = await fetch(uri);
    const metadata = await res.json();
    return metadata.image || null;
  } catch (err) {
    console.error("❌ Greška pri čitanju tokenURI metapodataka:", err);
    return null;
  }
};

const DashboardEarnerIssued = ({ userId }) => {
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔹 Učitaj izdate sertifikate iz backenda
  const fetchIssuedCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/requests");
      const allRequests = response.data;

      // Filtriraj samo izdate sertifikate za trenutnog korisnika
      const userIssued = allRequests.filter(
        (req) => req.status === "issued" && req.user?.id === userId
      );

      if (userIssued.length === 0) {
        setIssuedCertificates([]);
        setLastUpdated(new Date().toLocaleTimeString());
        return;
      }

      // 🔹 Učitaj slike iz tokenURI metapodataka
      const enriched = await Promise.all(
        userIssued.map(async (req) => {
          const imageUrl = await fetchImageFromTokenURI(req.token_uri);
          return { ...req, imageUrl };
        })
      );

      setIssuedCertificates(enriched);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Greška pri učitavanju izdatih sertifikata:", err);
      setError("Došlo je do greške pri učitavanju podataka sa servera.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Automatsko osvežavanje svakih 30 sekundi
  useEffect(() => {
    if (!userId) return;
    fetchIssuedCertificates();
    const interval = setInterval(fetchIssuedCertificates, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // === UI ===
  if (loading) {
    return <p className="text-blue-700">⏳ Učitavanje izdatih sertifikata...</p>;
  }

  if (error) {
    return <p className="text-red-600 font-medium">{error}</p>;
  }

  if (issuedCertificates.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-xl mb-3 font-semibold text-blue-700">
          Izdate sertifikate
        </h3>
        <p className="text-blue-700">
          Trenutno nemate izdatih sertifikata.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">
          Izdate sertifikate{" "}
          {issuedCertificates.length > 0 && (
            <span className="text-gray-500 text-sm font-normal">
              ({issuedCertificates.length})
            </span>
          )}
        </h3>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            ⏱ Poslednje osvežavanje: {lastUpdated}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issuedCertificates.map((req, index) => (
          <div
            key={req.id}
            className="border rounded-xl shadow-md p-4 bg-white flex flex-col justify-between transition duration-200 hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* 🔹 Tekstualni deo */}
              <div className="flex-1" style={{ maxWidth: "70%" }}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {req.certificate?.name || "Nepoznato"}
                </h3>
                <p className="text-gray-700">
                  <strong>Institucija:</strong>{" "}
                  {req.certificate?.organization?.name || "Nepoznato"}
                </p>
                <p className="text-gray-700">
                  <strong>Datum izdavanja:</strong>{" "}
                  {req.updated_at?.slice(0, 10) || "-"}
                </p>

                {expandedIndex === index && (
                  <>
                    <p className="text-gray-700 mt-2">
                      <strong>Ishodi učenja:</strong>{" "}
                      {req.certificate?.learning_outcomes || "Nema podataka"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Preduslovi:</strong>{" "}
                      {req.certificate?.prerequisites || "Nema podataka"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Trajanje:</strong>{" "}
                      {req.certificate?.duration || "N/A"}
                    </p>

                    {req.token_uri && (
                      <p className="text-sm text-blue-700 mt-2">
                        <strong>Token URI:</strong>{" "}
                        <a
                          href={req.token_uri}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {req.token_uri}
                        </a>
                      </p>
                    )}

                    {req.blockchain_tx_hash && (
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Blockchain TX:</strong>{" "}
                        <a
                          href={`https://sepolia.etherscan.io/tx/${req.blockchain_tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {req.blockchain_tx_hash.slice(0, 20)}...
                        </a>
                      </p>
                    )}
                  </>
                )}

                <button
                  onClick={() => toggleExpand(index)}
                  className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {expandedIndex === index ? "Prikaži manje" : "Prikaži više"}
                </button>
              </div>

              {/* 🔹 Slika iz IPFS metapodataka */}
              {req.imageUrl && (
                <div className="md:w-40 flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={req.imageUrl}
                    alt={`Slika za NFT ${req.certificate?.name}`}
                    className="rounded-lg object-contain w-full h-auto"
                  />
                </div>
              )}
            </div>

            {/* Kopiranje URI-ja */}
            <div className="mt-6 flex justify-start">
              {req.token_uri && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(req.token_uri);
                    alert("🔗 Link kopiran!");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  Kopiraj URI sertifikata
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardEarnerIssued;
