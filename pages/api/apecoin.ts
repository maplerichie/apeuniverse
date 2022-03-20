import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { ethers } from "ethers";

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

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      let { type, filter } = req.query;
      let isFilter = false;
      if (filter) {
        isFilter = true;
      }
      let data;
      switch (type) {
        case "0": // bayc
          data = await prisma.bayc.findMany({
            where: { apecoinClaimed: !isFilter },
          });
          break;
        case "1": // mayc
          data = await prisma.mayc.findMany({
            where: { apecoinClaimed: !isFilter, minted: isFilter },
          });
          break;
        case "2": // bakc
          data = await prisma.bakc.findMany({
            where: { apecoinClaimed: !isFilter, minted: isFilter },
          });
          break;
        default:
          res.status(404).json({ message: "Invalid type" });
          return;
      }
      res.status(200).json({ status: "ok", length: data.length, data: data });
      break;
    case "POST":
      let { t, auth } = body;
      if (auth != process.env.TOKEN_KEY + "lkc") {
        res.status(404).json({ message: "Authentication failed" });
        return;
      }
      try {
        let asset = {
          tokenId: body.tokenId,
          apecoinClaimed: body.apecoinClaimed,
        };
        switch (t) {
          case 0: // bayc
            asset["m1mutated"] = body.m1mutated;
            asset["m2mutated"] = body.m2mutated;
            await prisma.bayc.upsert({
              where: {
                tokenId: asset.tokenId,
              },
              update: asset,
              create: asset,
            });
            break;
          case 1: // mayc
            asset["minted"] = body.minted;
            await prisma.mayc.upsert({
              where: {
                tokenId: asset.tokenId,
              },
              update: asset,
              create: asset,
            });
            break;
          case 2: // bakc
            asset["minted"] = body.minted;
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
        let { type, tokenId } = body;
        let claimed = false;
        switch (type) {
          case 0:
            claimed = await apecoin.alphaClaimed(tokenId);
            await prisma.bayc.update({
              where: {
                tokenId: tokenId,
              },
              data: {
                apecoinClaimed: claimed,
              },
            });
            break;
          case 1:
            claimed = await apecoin.betaClaimed(tokenId);
            await prisma.mayc.update({
              where: {
                tokenId: tokenId,
              },
              data: {
                apecoinClaimed: claimed,
              },
            });
            break;
          case 2:
            claimed = await apecoin.gammaClaimed(tokenId);
            await prisma.bakc.update({
              where: {
                tokenId: tokenId,
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
