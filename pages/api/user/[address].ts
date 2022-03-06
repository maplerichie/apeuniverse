import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { generateNonce } from "../../../lib/ethers";
import { verifyJwt } from "../../../lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  let { address } = req.query;
  let token = req.headers.authorization?.slice(7);
  let verified = false,
    user;

  switch (method) {
    case "GET":
      if (token) {
        verified = await verifyJwt(token, address);
      }
      if (typeof address !== "string") {
        address = address[0];
      }
      if (verified) {
        user = await prisma.user.findUnique({
          where: { address: address },
          select: {
            id: true,
            address: true,
            name: true,
            ens: true,
            website: true,
            twitter: true,
            wechat: true,
            discord: true,
            message: true,
            avatarURI: true,
            status: true,
          },
        });
        res.status(200).json({ status: "ok", user: user, authenticated: true });
      } else {
        user = await prisma.user.findUnique({
          where: { address: address },
          select: { address: true },
        });
        if (user) {
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
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
