import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const collectionId = req.query.id;
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  switch (method) {
    case "GET":
      res.status(200).json(collection);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
