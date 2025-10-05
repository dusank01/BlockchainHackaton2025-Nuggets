import { useState, useEffect } from "react";
import IssueNFT from "./IssueNFT";
import api from "../api";

const DashboardIssuerPending = ({ userId, address }) => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // === Dohvati sve zahteve na čekanju iz iste organizacije kao issuer ===
  const fetchRequests = async () => {
    try {
      setError(null);
      setLoading(true);

      // 1️⃣ Dohvati korisnika (issuer-a)
      const userRes = await api.get(`/users/${userId}`);
      const orgId = userRes.data.organization_id;

      // 2️⃣ Dohvati sve zahteve
      const response = await api.get("/requests");
      const allRequests = response.data;

      // 3️⃣ Filtriraj samo pending zahteve iz iste organizacije
      const pending = allRequests.filter(
        (r) =>
          r.status === "pending" &&
          r.certificate?.organization_id === orgId
      );

      setRequests(pending);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Greška pri učitavanju zahteva:", err);
      setError("Došlo je do greške pri učitavanju zahteva.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Automatsko osvežavanje svakih 30 sekundi
  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // === Prikaz IssueNFT pogleda ===
  const handleIssue = (reqId) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    setSelectedRequest(req);
    setCurrentView("issue");
  };

  // === Povratak na dashboard (nakon izdavanja) ===
  const handleBack = (refresh) => {
    if (refresh && selectedRequest) {
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
    }
    setCurrentView("dashboard");
    setSelectedRequest(null);
  };

  // === Loading ekran ===
  if (loading) {
    return <p className="text-blue-700 p-6">⏳ Učitavanje zahteva...</p>;
  }

  // === Greška u učitavanju ===
  if (error) {
    return <p className="text-red-600 font-medium p-6">{error}</p>;
  }

  // === Pogled za izdavanje NFT-a ===
  if (currentView === "issue" && selectedRequest) {
    return <IssueNFT credential={selectedRequest} onBack={handleBack} />;
  }

  // === Glavni prikaz zahteva ===
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">
          Zahtevi za sertifikate na čekanju{" "}
          {requests.length > 0 && (
            <span className="text-gray-500 text-sm font-normal">
              ({requests.length})
            </span>
          )}
        </h3>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            ⏱ Poslednje osvežavanje: {lastUpdated}
          </p>
        )}
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">Nema trenutno zahteva za sertifikate.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            const student = req.user || {};
            const cert = req.certificate || {};
            const org = cert.organization || {};

            return (
              <div
                key={req.id}
                className="border p-4 rounded-xl shadow-sm bg-white relative flex flex-col transition duration-200 hover:shadow-lg"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {cert.name || "Nepoznato"}
                </h4>
                <p className="text-sm text-gray-700">
                  👤 Student: {student.first_name} {student.last_name}
                </p>
                <p className="text-sm text-gray-700">
                  ✉️ Email: {student.email}
                </p>
                <p className="text-sm text-gray-700">
                  🏫 Institucija: {org.name || "Nepoznato"}
                </p>

                {/* Dodatni detalji o sertifikatu */}
                {expandedId === req.id && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1 border-t border-gray-100 pt-2">
                    <p>
                      <strong>Ishodi učenja:</strong>{" "}
                      {cert.learning_outcomes || "Nema definisanih ishoda."}
                    </p>
                    <p>
                      <strong>Preduslovi:</strong>{" "}
                      {cert.prerequisites || "Nema definisanih preduslova."}
                    </p>
                    <p>
                      <strong>Trajanje:</strong> {cert.duration || "N/A"}
                    </p>
                    <p>
                      <strong>Datum kreiranja:</strong>{" "}
                      {req.created_at?.slice(0, 10)}
                    </p>
                  </div>
                )}

                {/* Dugme za prikaz više */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === req.id ? null : req.id)
                  }
                  className="text-blue-600 text-sm mt-3 self-start hover:underline"
                >
                  {expandedId === req.id ? "Prikaži manje" : "Prikaži više"}
                </button>

                {/* Dugme za izdavanje sertifikata */}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    onClick={() => handleIssue(req.id)}
                  >
                    Izdaj sertifikat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardIssuerPending;
