import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection } from "../../../models";
import prisma from "../../../lib/prisma";
import { getErc721, uintToNumber } from "../../../lib/ethers";

const openseaAssetsApi = "https://api.opensea.io/api/v1/assets";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      let { address } = body;

      const collections: Collection[] = await prisma.collection.findMany();
      collections.map(async (collection) => {
        let contract = getErc721(collection.address);
        let balanceOf = uintToNumber(await contract.balanceOf(address));
        let tokenIds = [];
        if (balanceOf > 0) {
          for (let i = 0; i < balanceOf; i++) {
            let tokenId = uintToNumber(
              await contract.tokenOfOwnerByIndex(address, i)
            );
            tokenIds.push(tokenId);
          }
          let requestUrl =
            openseaAssetsApi +
            "?asset_contract_address=" +
            collection.address +
            "&token_ids=" +
            tokenIds.join("&token_ids=");
          await fetch(requestUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((resj) => {
              for (let asset of resj.assets) {
                console.log(asset.image_url);
              }
            })
            .catch((err) => {
              console.log("ERROR: GET opensea assets ===>", err);
            });
        }
      });
      res.status(200).end();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
