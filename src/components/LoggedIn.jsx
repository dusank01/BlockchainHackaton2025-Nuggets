

const LoggedIn = ()=>{


return (


<section className="py-16 px-6 bg-white">
  <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">Kako funkcioniše?</h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
    {/* Korak 1: Student */}
    <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
      <div className="text-5xl mb-4">🎓</div>
      <h3 className="text-xl font-semibold mb-2">1. Student</h3>
      <p className="text-gray-600">
        Prijavljuje se pomoću MetaMask-a i bira mikrokredencijal koji želi da zatraži.
      </p>
    </div>

    {/* Korak 2: Zahtev */}
    <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
      <div className="text-5xl mb-4">📩</div>
      <h3 className="text-xl font-semibold mb-2">2. Zahtev</h3>
      <p className="text-gray-600">
        Student šalje zahtev za mikrokredencijal, uključujući potrebne informacije i dokumentaciju.
      </p>
    </div>

    {/* Korak 3: Issuer */}
    <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
      <div className="text-5xl mb-4">🧑‍🏫</div>
      <h3 className="text-xl font-semibold mb-2">3. Issuer</h3>
      <p className="text-gray-600">
        Issuer proverava ispunjenost preduslova i odlučuje da li da izda mikrokredencijal.
      </p>
    </div>

    {/* Korak 4: NFT */}
    <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
      <div className="text-5xl mb-4">🔗</div>
      <h3 className="text-xl font-semibold mb-2">4. NFT</h3>
      <p className="text-gray-600">
        Mikrokredencijal se izdaje kao NFT i trajno se beleži na blockchainu, verifikovan i dostupan svima.
      </p>
    </div>
  </div>
</section>


    );

};

export default LoggedIn;