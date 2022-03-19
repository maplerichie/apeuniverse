import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const file = fs.readFileSync("data/unclaimed.json", "utf-8");
  let unclaimed = JSON.parse(file)["bayc"];

  switch (method) {
    case "GET":
      res.status(200).json({ status: "ok", data: unclaimed });
      break;
    case "POST":
      let { tokenId } = body;
      tokenId = parseInt(tokenId);
      unclaimed.splice(unclaimed.indexOf(parseInt(tokenId)), 1);
      fs.writeFileSync(
        "data/unclaimed.json",
        JSON.stringify({ bayc: unclaimed }),
        "utf-8"
      );
      res.status(200).json({ status: "ok" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
