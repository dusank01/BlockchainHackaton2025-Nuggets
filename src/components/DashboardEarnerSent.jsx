import { useState, useEffect } from "react";
import api from "../api";

const DashboardEarnerSent = ({ userId }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔹 Dohvatanje zahteva iz backenda
  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get("/requests");
      const filtered = data.filter(
        (req) =>
          req.user?.id === userId &&
          ["pending", "approved"].includes(req.status) // prikazujemo sve koji nisu izdati ili odbijeni
      );

      setPendingRequests(filtered);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Greška pri učitavanju zahteva:", err);
      setError("Došlo je do greške pri učitavanju podataka.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Osvežavanje svakih 30 sekundi
  useEffect(() => {
    if (!userId) return;

    fetchPendingRequests(); // prvo učitavanje
    const interval = setInterval(fetchPendingRequests, 30000); // 30 sekundi

    return () => clearInterval(interval);
  }, [userId]);

  // === UI ===
  if (isLoading) {
    return <p className="text-blue-700">⏳ Učitavanje sertifikata...</p>;
  }

  if (error) {
    return <p className="text-red-600 font-medium">{error}</p>;
  }

  // 🌈 Helper za boje statusa
  const statusBadge = (status) => {
    const map = {
      pending: "text-yellow-800 bg-yellow-100",
      approved: "text-blue-800 bg-blue-100",
      issued: "text-green-800 bg-green-100",
      rejected: "text-red-800 bg-red-100",
    };
    const color = map[status] || "text-gray-800 bg-gray-100";
    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${color}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">
          Sertifikati na čekanju{" "}
          {pendingRequests.length > 0 && (
            <span className="text-gray-500 text-sm font-normal">
              ({pendingRequests.length})
            </span>
          )}
        </h3>
        {lastUpdated && (
          <p className="text-xs text-gray-500">
            ⏱ Poslednje osvežavanje: {lastUpdated}
          </p>
        )}
      </div>

      {pendingRequests.length === 0 ? (
        <p className="text-sm text-blue-700">
          Trenutno nemate nijedan zahtev na čekanju.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-blue-50 text-gray-700 text-left text-sm">
              <tr>
                <th className="px-4 py-2 border-b">Naziv sertifikata</th>
                <th className="px-4 py-2 border-b">Institucija</th>
                <th className="px-4 py-2 border-b">Datum slanja</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => {
                const cert = req.certificate || {};
                const org = cert.organization || {};

                return (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-2 border-b font-medium text-gray-800">
                      {cert.name || "Nepoznato"}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-600">
                      {org.name || "Nepoznato"}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-500">
                      {req.created_at?.slice(0, 10) || "-"}
                    </td>
                    <td className="px-4 py-2 border-b">{statusBadge(req.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardEarnerSent;
