import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { cors } from "../../../lib/cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  const { query, method } = req;
  let collectionId = req.query.id;
  if (typeof collectionId !== "string") {
    collectionId = collectionId[0];
  }
  const collection = await prisma.collection.findUnique({
    where: { id: parseInt(collectionId) },
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
