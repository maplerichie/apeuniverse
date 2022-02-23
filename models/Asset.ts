import { User } from "./User";

export type Asset = {
  id: number;
  assetKey: string;
  tokenId: number;
  userId: number;
  owner: User;
  imageURI: string;
};
