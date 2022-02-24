import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getEns, generateNonce, verifyMessage } from "../../../lib/ethers";
import { signJwt, verifyJwt } from "../../../lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  let token = req.headers.authorization?.slice(7);
  let verified;

  switch (method) {
    case "GET":
      const users = await prisma.user.findMany({
        where: { status: 1 },
        select: {
          address: true,
          name: true,
          ens: true,
          twitter: true,
          // discord: true,
          message: true,
          avatarURI: true,
        },
      });
      res.json(users);
      break;
    case "POST":
      let { address, timestamp, signature } = body;
      let user = await prisma.user.findUnique({
        where: { address: address },
        select: { id: true, address: true, nonce: true, status: true },
      });
      let signValid = verifyMessage(user.nonce, timestamp, signature, address);
      if (signValid) {
        let welcome = false;
        if (user.status === 0) {
          welcome = true;
          let ens = await getEns(address);
          user = await prisma.user.update({
            where: {
              address: user.address,
            },
            data: {
              status: 1,
              ens: ens ? ens : "",
              opensea: address,
              looksrare: address,
            },
            select: { id: true, address: true },
          });

          fetch("https://metaverist.com/api/asset/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, address: address }),
          });
        }
        const token = await signJwt(user.id, user.address);
        res
          .status(200)
          .json({ status: "ok", user: user, welcome: welcome, token: token });
      } else {
        res.status(403).json({ status: "error", message: "Invalid signature" });
      }
      break;
    case "PUT":
      if (token) {
        verified = await verifyJwt(token, body.address);
      }
      if (verified) {
        delete body.id;
        await prisma.user.update({
          where: {
            address: body.address,
          },
          data: body,
        });
        res.status(200).json({ status: "ok" });
      } else {
        res.status(403).json({ status: "error", message: "Invalid token" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
