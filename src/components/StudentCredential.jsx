import { useState } from "react";
import { useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

const fetchImageFromTokenURI = async (uri) => {
  try {
    const res = await fetch(uri);
    const metadata = await res.json();
    return metadata.image || null;
  } catch (err) {
    console.error("Greška pri čitanju tokenURI metapodataka:", err);
    return null;
  }
};

const StudentCredentials = ({address}) => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

   const handleShare = () => {
    const shareUrl = `${window.location.origin}/dashboard/earner/${address}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const fetchCredentials = async () => {
    console.log("Korisnik:", address);
if (!address) {
  alert("Greška: korisnička adresa nije dostupna.");
  return;
}

    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const tokenIds = await contract.getCredentialsByOwner(address);

      const allCredentials = await Promise.all(
  tokenIds.map(async (id) => {
    const tokenId = id.toString();
    const res = await contract.getCredential(tokenId);
    const uri = await contract.tokenURI(tokenId);
    const imageUrl = await fetchImageFromTokenURI(uri); // 🆕

    const data = {
      naziv: res[0],
      institucija: res[1],
      izvor: res[2],
      datum: res[3],
      ishodi: res[4],
      preduslovi: res[5],
      dodatneInfo: res[6],
      trajanje: res[7],
    };

    return {
      tokenId,
      uri,
      imageUrl, // 🆕 dodato u objekat
      ...data,
    };
  })
);


      setCredentials(allCredentials);
      setVisible(true);
    } catch (err) {
      console.error("Greška pri dohvatanju mikrokredencijala:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (address) {
    fetchCredentials();
  }
}, [address])

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4">     

      {loading && <p>Učitavanje...</p>}

      {visible && credentials.length === 0 && !loading && (
        <p>Nemate nijedan izdat mikrokredencijal.</p>
      )}

      {credentials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((c,index) => (
            <div
  key={c.tokenId}
  className="border rounded-xl shadow-md p-4 bg-white flex flex-col justify-between"
>
  <div className="flex flex-col md:flex-row gap-4">
    
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-2">{c.naziv}</h3>
      <p><strong>Institucija:</strong> {c.institucija}</p>
      <p><strong>Datum:</strong> {c.datum}</p>

      {expandedIndex === index && (
        <>
          <p><strong>Izvor:</strong> {c.izvor}</p>
          <p><strong>Ishodi:</strong> {c.ishodi}</p>
          <p><strong>Preduslovi:</strong> {c.preduslovi}</p>
          <p><strong>Dodatne informacije:</strong> {c.dodatneInfo}</p>
          <p><strong>Trajanje:</strong> {c.trajanje}</p>
          <p className="text-sm text-blue-700 mt-2">
            <strong>Token URI:</strong>{" "}
            <a href={c.uri} target="_blank" rel="noreferrer">{c.uri}</a>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Token ID: {c.tokenId}
          </p>
        </>
      )}

      
      <button
        onClick={() => toggleExpand(index)}
        className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
      >
        {expandedIndex === index ? "Prikaži manje" : "Prikaži više"}
      </button>
    </div>

    
    {c.imageUrl && (
      <div className="md:w-48 flex-shrink-0 mx-auto md:mx-0">
        <img
          src={c.imageUrl}
          alt={`Slika za NFT ${c.tokenId}`}
          className="rounded-lg object-contain w-full h-auto"
        />
      </div>
    )}
  </div>

  
  <div className="mt-6 flex justify-start">
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link kopiran!");
      }}
      className="text-xs text-gray-500 hover:text-gray-800 underline"
    >
      🔗 Kopiraj link
    </button>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCredentials;
