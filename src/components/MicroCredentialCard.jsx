// src/components/MicroCredentialCard.jsx
const MicroCredentialCard = ({ credential, onRequest }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 w-full md:w-[300px]">
      <h3 className="text-lg font-semibold">{credential.title}</h3>
      <p className="text-sm mt-2">{credential.description}</p>
      <ul className="mt-2 text-xs list-disc list-inside">
        {credential.competencies.map((comp, idx) => (
          <li key={idx}>{comp}</li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={() => onRequest(credential.id)}
      >
        Pošalji zahtev
      </button>
    </div>
  );
};

export default MicroCredentialCard;
