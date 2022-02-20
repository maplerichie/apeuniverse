import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getEns, generateNonce, verifyMessage } from "../../../lib/ethers";
import { signJwt } from "../../../lib/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      const users = await prisma.user.findMany();
      res.json(users);
      break;
    case "POST":
      let { address, timestamp, signature } = body;
      let user = await prisma.user.findUnique({
        where: { address: address },
        // select: { address: true, nonce: true },
      });
      let signValid = verifyMessage(user.nonce, timestamp, signature, address);
      if (signValid) {
        if (user.status === 0) {
          let ens = await getEns(address);
          user = await prisma.user.update({
            where: {
              address: user.address,
            },
            data: {
              status: 1,
              ens: ens ? ens : "",
            },
            select: { id: true, address: true },
          });

          fetch("http://localhost:3000/api/asset/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: address }),
          });
        }
        const token = await signJwt(user.id, user.address);
        res.status(200).json({ status: "ok", user: user, token: token });
      } else {
        res.status(403).json({ status: "error", message: "Invalid signature" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
