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
  let haveApe = false;

  switch (method) {
    case "POST":
      let { userId, address } = body;

      const collections = await prisma.collection.findMany();
      await collections.map(async (collection) => {
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
          if (
            !haveApe &&
            (collection.address ==
              "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" ||
              collection.address ==
                "0x60E4d786628Fea6478F785A6d7e704777c86a7c6")
          ) {
            await prisma.user.update({
              where: {
                address: address,
              },
              data: {
                status: 1,
              },
            });
            haveApe = true;
          }
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
                  status: haveApe ? 1 : 0,
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
          //     Origin: process.env.DOMAIN_URL,
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
