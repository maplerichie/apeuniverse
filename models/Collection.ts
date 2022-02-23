import { Asset } from "./Asset";

export type Collection = {
  id: number;
  address: string;
  tokenURI: string;
  name: string;
  website: string;
  twitter: string;
  discord: string;
  opensea: string;
  looksrare: string;
  assets: Asset[];
};
