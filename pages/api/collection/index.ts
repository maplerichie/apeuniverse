import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const collections = await prisma.collection.findMany({
    where: { status: 1 },
    select: {
      id: true,
      address: true,
      name: true,
      website: true,
      discord: true,
      twitter: true,
      opensea: true,
      looksrare: true,
    },
  });
  for (let i = 0; i < collections.length; i++) {
    const assets = await prisma.asset.findMany({
      where: { status: 1, collectionId: collections[i].id },
      select: {
        assetKey: true,
        tokenId: true,
        imageURI: true,
        collectionId: true,
        owner: true,
      },
    });
    collections[i]["assets"] = assets;
  }
  res.json(collections);
}
