import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyJwt } from "../../../lib/jwt";
import { cors } from "../../../lib/cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  const { query, method } = req;
  let { address } = req.query;
  let token = req.headers.authorization?.slice(7);
  let verified = false,
    user;

  switch (method) {
    case "GET":
      if (typeof address !== "string") {
        address = address[0];
      }
      if (token) {
        verified = await verifyJwt(token, address);
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
        res
          .status(200)
          .json({ status: "ok", user: user, authenticated: verified });
      } else {
        res.status(404).json({ message: "User not found" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
