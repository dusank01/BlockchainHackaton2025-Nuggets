// src/utils/roles.js

export const ISSUERS = [
   // zameni pravim adresama
  "0x0e941f1e0d62918b4702b5f03f55955908dc6892",
  "0x1574245569Df59717dDE498E6723C912Cb68d613"
];

export const isIssuer = (address) => {
  return ISSUERS.map(addr => addr.toLowerCase()).includes(address.toLowerCase());
};
