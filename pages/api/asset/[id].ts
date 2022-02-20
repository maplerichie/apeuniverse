import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const assetId = req.query.id;
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  switch (method) {
    case "GET":
      res.status(200).json(asset);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
