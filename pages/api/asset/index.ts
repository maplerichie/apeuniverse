import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const assets = await prisma.asset.findMany({
    where: { status: 1 },
    select: {
      assetKey: true,
      tokenId: true,
      imageURI: true,
      collectionId: true,
      userId: true,
    },
  });
  res.json(assets);
}
