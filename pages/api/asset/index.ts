import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { cors } from "../../../lib/cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
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
