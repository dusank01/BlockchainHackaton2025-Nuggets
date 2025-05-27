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
  },
  {
    id: 2,
    title: "Blockchain Osnove",
    description: "Razumevanje pametnih ugovora i EVM-a.",
    competencies: ["Smart Contracts", "Ethereum", "Solidity"],
  },
  {
    id: 3,
    title: "React za početnike",
    description: "Izrada SPA aplikacija koristeći React biblioteku.",
    competencies: ["React", "JSX", "Hooks"],
  },
];

const DashboardEarner = ({ address }) => {
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
      <h2 className="text-2xl font-bold mb-4">Dobrodošao, Earner</h2>
      <p className="text-sm text-gray-600 mb-6">Wallet: {address}</p>
      <StudentCredentials address={address} />
      


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
    </div>
  );
};

export default DashboardEarner;

