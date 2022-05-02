import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { ethers } from "ethers";
import { cors } from "../../lib/cors";

let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
let apecoinAbi = [
  "function alphaClaimed(uint256) public view returns (bool)",
  "function betaClaimed(uint256) public view returns (bool)",
  "function gammaClaimed(uint256) public view returns (bool)",
];
let apecoin = new ethers.Contract(
  "0x025c6da5bd0e6a5dd1350fda9e3b6a614b205a1f",
  apecoinAbi,
  provider
);
let otherdeedAbi = [
  "function alphaClaimed(uint256) public view returns (bool)",
  "function betaClaimed(uint256) public view returns (bool)",
];
let otherdeed = new ethers.Contract(
  "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258",
  otherdeedAbi,
  provider
);

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  const { method, body } = req;
  let { auth, type, tokenId, ape, deed, m1, m2, minted } = req.body;

  switch (method) {
    case "GET":
      type = req.query.type;
      ape = req.query.ape;
      deed = req.query.deed;
      let data = [];
      switch (Number(type)) {
        case 0: // bayc
          if (ape) {
            data = await prisma.bayc.findMany({
              where: { apecoinClaimed: false },
            });
          }
          if (deed) {
            data = await prisma.bayc.findMany({
              where: { otherdeedClaimed: false },
            });
          }
          break;
        case 1: // mayc
          if (ape) {
            data = await prisma.mayc.findMany({
              where: { apecoinClaimed: false, minted: true },
            });
          }
          if (deed) {
            data = await prisma.mayc.findMany({
              where: { otherdeedClaimed: false, minted: true },
            });
          }
          break;
        case 2: // bakc
          data = await prisma.bakc.findMany({
            where: { apecoinClaimed: false, minted: true },
          });
          break;
        default:
          res.status(404).json({ message: "Invalid type" });
          return;
      }
      res.status(200).json({ status: "ok", length: data.length, data: data });
      break;
    case "POST":
      if (auth != process.env.TOKEN_KEY + "lkc") {
        res.status(404).json({ message: "Authentication failed" });
        return;
      }
      try {
        let asset: any = {
          tokenId: tokenId,
        };
        if (ape) {
          asset.apecoinClaimed = body.apecoinClaimed;
        }
        if (deed) {
          asset.otherdeedClaimed = body.otherdeedClaimed;
        }
        if (m1) {
          asset.m1mutated = body.m1mutated;
        }
        if (m2) {
          asset.m2mutated = body.m2mutated;
        }
        if (minted) {
          asset.minted = body.minted;
        }

        switch (Number(type)) {
          case 0: // bayc
            await prisma.bayc.upsert({
              where: {
                tokenId: asset.tokenId,
              },
              update: asset,
              create: asset,
            });
            break;
          case 1: // mayc
            await prisma.mayc.upsert({
              where: {
                tokenId: asset.tokenId,
              },
              update: asset,
              create: asset,
            });
            break;
          case 2: // bakc
            await prisma.bakc.upsert({
              where: {
                tokenId: asset.tokenId,
              },
              update: asset,
              create: asset,
            });
            break;
          default:
            res.status(404).json({ message: "Invalid type" });
            return;
        }
        res.status(200).json({ status: "ok" });
      } catch (_) {
        res.status(500).json({ message: "Create/Update failed" });
      }
      break;
    case "PUT":
      try {
        let claimed = false;
        switch (Number(type)) {
          case 0:
            if (ape) {
              claimed = await apecoin.alphaClaimed(tokenId);
              await prisma.bayc.update({
                where: {
                  tokenId: Number(tokenId),
                },
                data: {
                  apecoinClaimed: claimed,
                },
              });
            }
            if (deed) {
              claimed = await otherdeed.alphaClaimed(tokenId);
              await prisma.bayc.update({
                where: {
                  tokenId: Number(tokenId),
                },
                data: {
                  otherdeedClaimed: claimed,
                },
              });
            }
            break;
          case 1:
            if (ape) {
              claimed = await apecoin.alphaClaimed(tokenId);
              await prisma.mayc.update({
                where: {
                  tokenId: Number(tokenId),
                },
                data: {
                  apecoinClaimed: claimed,
                },
              });
            }
            if (deed) {
              claimed = await otherdeed.alphaClaimed(tokenId);
              await prisma.mayc.update({
                where: {
                  tokenId: Number(tokenId),
                },
                data: {
                  otherdeedClaimed: claimed,
                },
              });
            }
            break;
          case 2:
            claimed = await otherdeed.gammaClaimed(tokenId);
            await prisma.bakc.update({
              where: {
                tokenId: Number(tokenId),
              },
              data: {
                apecoinClaimed: claimed,
              },
            });
            break;
          default:
            res.status(404).json({ message: "Invalid type" });
            return;
        }
        res.status(200).json({ status: "ok" });
      } catch (_) {
        res.status(500).json({ message: "Server error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
