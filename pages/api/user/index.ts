import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getEns, generateNonce, verifyMessage } from "../../../lib/ethers";
import { signJwt, verifyJwt } from "../../../lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  let token = req.headers.authorization?.slice(7);
  let verified = false;
  let haveApe = false;

  switch (method) {
    case "GET":
      const users = await prisma.user.findMany({
        where: { status: 1 },
        select: {
          address: true,
          name: true,
          ens: true,
          twitter: true,
          // discord: true,
          // message: true,
          avatarURI: true,
        },
      });
      res.status(200).json(users);
      break;
    case "POST":
      let { userAddress, assets } = body;
      let user = await prisma.user.findUnique({
        where: { address: userAddress },
        select: { id: true, address: true, nonce: true, status: true },
      });
      if (!user) {
        let nonce = generateNonce();
        user = await prisma.user.create({
          data: {
            address: userAddress,
            nonce: nonce,
          },
        });
      }
      let welcome = false;
      if (user.status === 0) {
        welcome = true;
        let ens = await getEns(userAddress);
        await prisma.user.update({
          where: {
            address: user.address,
          },
          data: {
            ens: ens ? ens : "",
          },
          select: { id: true, address: true },
        });

        if (ens == "apeuniverse.eth") {
          await prisma.user.update({
            where: {
              address: userAddress,
            },
            data: {
              status: 1,
            },
          });
        }
      }
      for (let asset of assets) {
        if (
          !haveApe &&
          (asset.address.toLowerCase() ==
            "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D".toLowerCase() ||
            asset.address.toLowerCase() ==
              "0x60E4d786628Fea6478F785A6d7e704777c86a7c6".toLowerCase())
        ) {
          await prisma.user.update({
            where: {
              address: userAddress,
            },
            data: {
              status: 1,
            },
          });
          haveApe = true;
        }
        const collection = await prisma.collection.findUnique({
          where: {
            address: asset.address,
          },
        });
        let assetObj = {
          assetKey: asset.address.slice(-8) + asset.tokenId.padStart(8, "0"),
          imageURI: asset.imageURI,
          collectionId: collection.id,
          tokenId: asset.tokenId,
          userId: user.id,
        };
        await prisma.asset.upsert({
          where: {
            assetKey: assetObj.assetKey,
          },
          update: assetObj,
          create: assetObj,
        });
      }
      if (assets.length == 0) {
        await prisma.asset.updateMany({
          where: {
            userId: user.id,
          },
          data: {
            userId: null,
            status: 0,
          },
        });
      }
      if (haveApe) {
        await prisma.asset.updateMany({
          where: {
            userId: user.id,
          },
          data: {
            status: 1,
          },
        });
      } else {
        await prisma.user.update({
          where: {
            address: userAddress,
          },
          data: {
            status: 0,
          },
        });
      }
      token = await signJwt(user.id, user.address);
      res
        .status(200)
        .json({ status: "ok", user: user, welcome: welcome, token: token });
      break;
    case "PUT":
      if (token) {
        verified = await verifyJwt(token, body.address);
      }
      if (verified) {
        delete body.id;
        let address = body.address;
        delete body.address;
        await prisma.user.update({
          where: {
            address: address,
          },
          data: body,
        });
        res.status(200).json({ status: "ok" });
      } else {
        res.status(403).json({ status: "error", message: "Invalid token" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
