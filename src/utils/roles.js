// src/utils/roles.js

export const ISSUERS = [
   // zameni pravim adresama
  "",
  ""
];

export const isIssuer = (address) => {
  return ISSUERS.map(addr => addr.toLowerCase()).includes(address.toLowerCase());
};
