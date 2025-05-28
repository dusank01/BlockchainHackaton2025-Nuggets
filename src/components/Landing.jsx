// src/components/Landing.jsx
import { Link } from "react-router-dom";


const Landing = () => {


  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Dobrodošli na Microcredential platformu
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Platforma za izdavanje, pregled i verifikaciju mikrokredencijala koristeći blockchain tehnologiju.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Prijavi se putem MetaMask-a
        </Link>
      </div>
    </div>
  );
};

export default Landing;
