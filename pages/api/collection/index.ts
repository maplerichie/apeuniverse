import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { filter } = req.query;
  let collections = [];
  if (filter) {
    if (typeof filter !== "string") {
      filter = filter[0];
    }
    collections = await prisma.collection.findMany({
      where: { status: 1 },
      select: {
        address: true,
      },
    });
    let temp = [];
    for (let i = 0; i < collections.length; i++) {
      temp.push(collections[i]["address"]);
    }
    collections = temp;
  } else {
    collections = await prisma.collection.findMany({
      where: { status: 1 },
      select: {
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
          tokenId: true,
          imageURI: true,
          owner: {
            select: {
              ens: true,
              name: true,
              address: true,
            },
          },
        },
      });
      collections[i]["assets"] = assets;
    }
  }
  res.status(200).json(collections);
}
