import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { generateNonce } from "../../../lib/ethers";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  let { address } = req.query;
  if (typeof address !== "string") {
    address = address[0];
  }
  let user = await prisma.user.findUnique({
    where: { address: address },
    // select: { address: true, nonce: true },
  });

  switch (method) {
    case "GET":
      if (user) {
        // if (user.status === 1) {
        //   res.status(200).json({ status: "ok", user: user });
        // } else {
        let nonce = generateNonce();
        await prisma.user.update({
          where: {
            address: user.address,
          },
          data: {
            address: address,
            nonce: nonce,
          },
        });
        res.status(202).json({ status: "ok", nonce: nonce });
        // }
      } else {
        let nonce = generateNonce();
        await prisma.user.create({
          data: {
            address: address,
            nonce: nonce,
          },
        });
        res.status(201).json({ status: "ok", nonce: nonce });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
