import { useState } from "react";

const WalletAddress = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset poruku nakon 1.5s
    });
  };

  return (
    <div
      onClick={handleCopy}
      className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-200 transition"
      title="Klikni da kopiraš adresu"
    >
      👤 {address.slice(0, 6)}...{address.slice(-4)}
      {copied && <span className="ml-2 text-green-600">✓</span>}
    </div>
  );
};

export default WalletAddress;
