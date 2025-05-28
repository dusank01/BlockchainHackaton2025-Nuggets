// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import WalletAddress from "./WalletAdress";

const Navbar = ({ address, role }) => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Welcome {role} 
      </Link>

      <div className="flex gap-6 items-center">
        {role === "earner" && (
          <>
            <Link to="/dashboard/earner/${address}" className="hover:underline">
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
          <WalletAddress address={address} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
