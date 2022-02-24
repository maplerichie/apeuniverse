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
      let { userId, address } = body;

      const collections = await prisma.collection.findMany();
      collections.map(async (collection) => {
        let contract = getErc721(collection.address);
        let balanceOf = uintToNumber(await contract.balanceOf(address));
        // let tokenIds = [];
        console.log(collection.name, address, balanceOf);
        try {
          await prisma.asset.updateMany({
            where: {
              collectionId: {
                equals: collection.id,
              },
              owner: {
                is: {
                  address: address,
                },
              },
            },
            data: {
              status: 0,
            },
          });
        } catch (err) {
          console.log("ERROR: Reset assets status ===>", err);
        }
        if (balanceOf > 0) {
          for (let i = 0; i < balanceOf; i++) {
            let tokenId = uintToNumber(
              await contract.tokenOfOwnerByIndex(address, i)
            );
            await fetch(collection.tokenURI + tokenId, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then(async (resj) => {
                let asset = {
                  assetKey:
                    collection.address.slice(-8) +
                    String(tokenId).padStart(8, "0"),
                  imageURI: resj.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  ),
                  collectionId: collection.id,
                  tokenId: tokenId,
                  status: 1,
                  userId: parseInt(userId),
                };
                await prisma.asset.upsert({
                  where: {
                    assetKey: asset.assetKey,
                  },
                  update: asset,
                  create: asset,
                });
              })
              .catch((err) => {
                console.log("ERROR: GET metadata ===>", err);
              });
            // tokenIds.push(tokenId);
          }
          // console.log(upsertAssets);
          // let requestUrl =
          //   openseaAssetsApi +
          //   "?asset_contract_address=" +
          //   collection.address +
          //   "&token_ids=" +
          //   tokenIds.join("&token_ids=");

          // await fetch(requestUrl, {
          //   method: "GET",
          //   headers: {
          //     "Content-Type": "application/json",
          //     Origin: "https://metaverist.com",
          //   },
          // })
          //   .then((response) => response.json())
          //   .then(async (resj) => {
          //     let assets = [];
          //     for (let asset of resj.assets) {
          //       let ast = {
          //         collectionId: collection.id,
          //         tokenId: parseInt(asset.token_id),
          //         imageURI: asset.image_preview_url,
          //         status: 1,
          //         userId: userId,
          //       };
          //       assets.push(ast);
          //     }
          //     await prisma.user.createMany({
          //       data: assets,
          //     });
          //   })
          //   .catch((err) => {
          //     console.log("ERROR: GET opensea assets ===>", err);
          //   });
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
