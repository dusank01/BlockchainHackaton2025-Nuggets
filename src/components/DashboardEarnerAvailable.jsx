// src/components/DashboardEarner.jsx
import { useState } from "react";
import MicroCredentialCard from "./MicroCredentialCard";
import StudentCredentials from "./StudentCredential";

const dummyCredentials = [
  {
    id: 1,
    title: "Osnove Web Programiranja",
    description: "Uvod u HTML, CSS i JavaScript.",
    competencies: ["HTML", "CSS", "JavaScript"],
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
  {
    id: 2,
    title: "Blockchain Osnove",
    description: "Razumevanje pametnih ugovora i EVM-a.",
    competencies: ["Smart Contracts", "Ethereum", "Solidity"],
    issuer: "0x1574245569Df59717dDE498E6723C912Cb68d613"
  },
  {
    id: 3,
    title: "React za početnike",
    description: "Izrada SPA aplikacija koristeći React biblioteku.",
    competencies: ["React", "JSX", "Hooks"],
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
];

const DashboardEarnerAvailable = ({ address }) => {
  const [requests, setRequests] = useState([]);

  const handleRequest = (credentialId) => {
    if (requests.includes(credentialId)) {
      alert("Već ste poslali zahtev za ovaj mikrokredencijal.");
      return;
    }

    setRequests([...requests, credentialId]);
    alert("Zahtev uspešno poslat!");
    // Ovde kasnije dodaj poziv ka pametnom ugovoru
  };


  return (
    <div className="p-6">
      <h3 className="text-xl mb-2">Dostupni mikrokredencijali</h3>
      <div className="flex flex-wrap gap-4">
        {dummyCredentials.map((credential) => (
          <MicroCredentialCard
            key={credential.id}
            credential={credential}
            onRequest={handleRequest}
          />
        ))}
      </div>

    </div>
  );
};

export default DashboardEarnerAvailable;

