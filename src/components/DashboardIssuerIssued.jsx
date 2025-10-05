import { useState, useEffect } from "react";
import api from "../api";

const resolveIPFS = (uri) =>
  uri?.startsWith("ipfs://") ? uri.replace("ipfs://", "https://ipfs.io/ipfs/") : uri;

const DashboardIssuerIssued = ({ address }) => {
  const [records, setRecords] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIssuedRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blockchain-records");
      const data = Array.isArray(res.data) ? res.data : [];

      const filtered = data.filter(
        (r) =>
          r.issuer_address &&
          address &&
          r.issuer_address.toLowerCase() === address.toLowerCase()
      );

      setRecords(filtered);
    } catch (err) {
      console.error("❌ Greška pri učitavanju izdatih mikrokredencijala:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchIssuedRecords();
  }, [address]);

  const toggleExpand = (index) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h3 className="text-xl mb-4 font-semibold text-blue-700">
        Izdati mikrokredencijali
      </h3>

      {records.length === 0 ? (
        <p className="text-gray-500">
          Još uvek niste izdali nijedan mikrokredencijal.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map((r, index) => {
            const cert = r.certificate || {};
            const org = cert.organization || {};

            return (
              <div
                key={r.id}
                className="border p-4 rounded-xl shadow-sm bg-white transition-all hover:shadow-md"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  🎓 {cert.name || "Nepoznat naziv"}
                </h4>

                <p className="text-sm text-gray-700">
                  <strong>Institucija:</strong> {org.name || "Nepoznata"}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Student (Earner):</strong> {r.earner_address}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Trajanje:</strong> {cert.duration || "N/A"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  <strong>Tx Hash:</strong>{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${r.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {r.tx_hash
                      ? `${r.tx_hash.slice(0, 10)}...${r.tx_hash.slice(-6)}`
                      : "Nepoznato"}
                  </a>
                </p>

                <p className="text-xs text-gray-500">
                  <strong>Izdato:</strong>{" "}
                  {r.created_at ? r.created_at.slice(0, 10) : "Nepoznato"}
                </p>

                {expandedIndex === index && (
                  <div className="mt-3 text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-3">
                    <p>
                      <strong>Ishodi učenja:</strong>
                      <br />
                      {cert.learning_outcomes || "Nisu definisani ishodi."}
                    </p>

                    <p>
                      <strong>Preduslovi:</strong>
                      <br />
                      {cert.prerequisites || "Nema navedenih preduslova."}
                    </p>

                    <p>
                      <strong>Token URI (IPFS):</strong>{" "}
                      {r.token_uri ? (
                        <a
                          href={resolveIPFS(r.token_uri)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          {r.token_uri}
                        </a>
                      ) : (
                        "Nema URI"
                      )}
                    </p>

                    <p>
                      <strong>Izvor:</strong> MicroCredentialChain
                    </p>
                  </div>
                )}

                <button
                  onClick={() => toggleExpand(index)}
                  className="mt-3 text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {expandedIndex === index
                    ? "Prikaži manje"
                    : "Prikaži više detalja"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerIssued;
