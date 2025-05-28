// src/utils/roles.js

export const ISSUERS = [
   // zameni pravim adresama
  "0x1574245569df59717dde498e6723c912cb68d613",
  ""
];

export const isIssuer = (address) => {
  return ISSUERS.map(addr => addr.toLowerCase()).includes(address.toLowerCase());
};
