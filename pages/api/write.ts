import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  fs.writeFileSync("meta/" + body.from + ".json", JSON.stringify(body.data));
  res.status(200).end();
}
