// src/utils/roles.js

export const ISSUERS = [
   // zameni pravim adresama
  "0x0e941f1e0d62918b4702b5f03f55955908dc6892",
  ""
];

export const isIssuer = (address) => {
  return ISSUERS.map(addr => addr.toLowerCase()).includes(address.toLowerCase());
};
