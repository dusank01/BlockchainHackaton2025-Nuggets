// src/components/DashboardEarner.jsx
import { useState } from "react";
import MicroCredentialCard from "./MicroCredentialCard";
import StudentCredentials from "./StudentCredential";

const dummyCredentials = [
  {
    id: 1,
  title: "Elektronsko poslovanje",
  institution:"Fakultet organizacionih nauka, Univerzitet u Beogradu",
source:"Formalan",
competencies: "Studenti primenjuju stečena teorijska i praktična znanja za razvoj sistema elektronskog poslovanja u različitim oblastima, kao i za implementaciju jednostavnih sistema elektronskog poslovanja primenom sistema za upravljanje sadržajem, sistema za upravljanje odnosima sa klijentima i softvera za razvoj elektronskih prodavnica.",
preconditions:"Položena 4 domaća zadatka, pismeni ispit i odbranjen projekat",
description: "Uvod u HTML, CSS i JavaScript.",
duration:"5 godina",
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreibpabo4jbhsdcdkbz37ijdske54lv7ivhvpuzfozi76urwom3g6qm",
issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
  {
    id: 2,
    title: "Informacioni sistemi",
    institution: "Fakultet organizacionih nauka, Univerzitet u Beogradu",
    source: "Formalan",
    competencies: "Studenti analiziraju i projektuju informacioni sistem korišćenjem modernih alata i metodologija, uključujući modelovanje procesa i strukture podataka.",
    
    preconditions: "Položeni kolokvijumi, prisustvo na vežbama, domaći zadatak",
    description: "Teorijski i praktični uvod u koncept informacionih sistema.",
    duration: "1 semestar",
    
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreifwdkpy3dubmts6zknfl3eqv3524e5hdwcm7qmmlooxdhkux2xfeq",
    issuer: "0x1574245569df59717dde498e6723c912cb68d613"
  },
  {
    id: 3,
    title: "Računarske mreže",
    institution: "Fakultet organizacionih nauka, Univerzitet u Beogradu",
    source: "Formalan",
    competencies: "Studenti razumeju arhitekturu mreža, TCP/IP model, IP adresiranje i primenjuju osnovne principe mrežnog inženjeringa.",
    preconditions: "Položen test iz teorije, realizovan praktični projekat",
    description: "Uvod u mrežne protokole i računarske komunikacije.",
    duration: "1 godina",
    
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreicrjmyohw3fx7tucvxsy3jublq7sn2clo3qr5orl2hle26nimymeu",
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
  {
    id: 4,
    title: "Programiranje 1",
    institution: "Fakultet organizacionih nauka, Univerzitet u Beogradu",
    source: "Formalan",
    competencies: "Studenti implementiraju osnovne algoritme i strukture podataka koristeći programski jezik C, kao i razvijaju male konzolne aplikacije.",
    
    preconditions: "Položen pismeni i usmeni deo ispita, redovno prisustvo",
    description: "Osnovni kurs programiranja u C jeziku sa praktičnim primerima.",
    duration: "1 semestar",
    
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreifzs7g7aml6t5kuzor6npejfa4t7svnubigdrnym4kdklmzd67afa",
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
  {
    id: 5,
    title: "Osnove baza podataka",
    institution: "Fakultet organizacionih nauka, Univerzitet u Beogradu",
    source: "Formalan",
    competencies: "Studenti projektuju, implementiraju i upravljaju relacionim bazama podataka koristeći SQL jezik i alate poput MySQL i PostgreSQL.", 
    preconditions: "Uspešno realizovan projekat i položen teorijski deo",
    description: "Teorijska i praktična osnova za rad sa bazama podataka.",
    duration: "1 semestar",
    
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreihd6se5jdtxqlx47xvmwfmtxiq75mock2uwzqopvewsarge5c72gy",
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  },
  {
    id: 6,
    title: "Softversko inženjerstvo",
    institution: "Fakultet organizacionih nauka, Univerzitet u Beogradu",
    source: "Formalan",
    competencies: "Studenti primenjuju principe životnog ciklusa razvoja softvera, koriste alate za verzionisanje, testiranje i modelovanje sistema.",
    preconditions: "Domaći zadaci, timski projekat, položen završni ispit",
    description: "Pregled metodologija razvoja softvera i uloga u timu.",
    duration: "2 semestra",
    
tokenURI:"https://gateway.pinata.cloud/ipfs/bafkreigbzqzjdheoiu5od3mpus6gzv2nuhuaeqp5kzv6hj72iuxgo7cjbi",
    issuer: "0x0E941f1E0D62918B4702b5F03f55955908Dc6892"
  }
]
;

const DashboardEarnerAvailable = ({ address }) => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = (credentialId) => {
    if (requests.includes(credentialId)) {
      setModalMessage("⚠ Već ste poslali zahtev za ovaj mikrokredencijal.");
      setIsLoading(false);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      return;
    }

    setRequests([...requests, credentialId]);
    setModalMessage("🔄 Slanje zahteva...");
    setIsLoading(true);
    setShowModal(true);

   
    setTimeout(() => {
      setModalMessage("✅ Zahtev uspešno poslat!");
      setIsLoading(false);
      setTimeout(() => setShowModal(false), 2000);
    }, 2000);
  };

  return (
    <div className="p-6">
      <h3 className="text-xl mb-2" style={{backgroundColor: "white", display:"inline-block"}}><b>Dostupni mikrokredencijali</b></h3>
      <div className="flex flex-wrap gap-4">
        {dummyCredentials.map((credential) => (
          <MicroCredentialCard
            key={credential.id}
            credential={credential}
            onRequest={handleRequest}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center transform transition duration-300">
            <p className="text-lg font-medium mb-4">{modalMessage}</p>
            {isLoading && (
              <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse mx-auto" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEarnerAvailable;