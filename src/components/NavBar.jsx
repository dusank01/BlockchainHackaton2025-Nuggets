// src/components/Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = ({ address, role }) => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Microcredential {role} app
      </Link>

      <div className="flex gap-6 items-center">
        {role === "earner" && (
          <>
            <Link to="/dashboard/earner" className="hover:underline">
              Moji mikrokredencijali
            </Link>
            <Link to="/available" className="hover:underline">
              Dostupni mikrokredencijali
            </Link>
            <Link to="/sent" className="hover:underline">
              Poslati mikrokredencijali
            </Link>
          </>
        )}

        {role === "issuer" && (
          <>
            <Link to="/pending" className="hover:underline">
              Zahtevi za izdavanje
            </Link>
            <Link to="/issued" className="hover:underline">
              Izdate potvrde
            </Link>
          </>
        )}

        {address && (
          <div className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
            <div>👤 {address.slice(0, 6)}...{address.slice(-4)}</div>
          </div>         
        )}
      </div>
    </nav>
  );
};

export default Navbar;
