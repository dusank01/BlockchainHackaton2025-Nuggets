// src/components/DashboardEarner.jsx
import { useState } from "react";
import MicroCredentialCard from "./MicroCredentialCard";
import StudentCredentials from "./StudentCredential";


const DashboardEarnerSent = ({ address }) => {
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
         <div className="mt-10">
        <h3 className="text-xl mb-2">Poslati zahtevi</h3>
        <ul className="list-disc list-inside text-sm">
          {requests.length === 0 ? (
            <li>Nema još poslatih zahteva.</li>
          ) : (
            requests.map((id) => {
              const cred = dummyCredentials.find((c) => c.id === id);
              return <li key={id}>{cred.title}</li>;
            })
          )}
        </ul>
      </div>
  );
};

export default DashboardEarnerSent;

