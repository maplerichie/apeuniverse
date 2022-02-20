import { providers, utils, Contract } from "ethers";

const erc721Abi = [
  "function balanceOf(address) external view returns (uint256)",
  "function tokenURI(uint256) external view returns (string)",
  "function tokenOfOwnerByIndex(address, uint256) external view returns (uint256)",
];

let provider = new providers.CloudflareProvider();

export const getEns = async (address: string) => {
  return await provider.lookupAddress(address);
};

export const generateNonce = () => {
  return Math.floor(1000 + Math.random() * 9999);
};

export const verifyMessage = async (
  nonce: Number,
  timestamp: number,
  signature: string,
  address: string
) => {
  const message = `Welcome to ApeUniverse.\n
    Nonce: ${nonce}\nTimestamp: ${timestamp}`;
  const signerAddr = utils.verifyMessage(message, signature);

  return signerAddr === address;
};

export const getErc721 = (contract) => {
  if (!provider) {
    console.log("provider error", provider);
    return;
  }
  return new Contract(contract, erc721Abi, provider);
};

export const uintToNumber = (uint) => {
  return uint.toNumber();
};

export default provider;
