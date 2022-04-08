import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");
import { cors } from "../../lib/cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  const { body } = req;
  fs.writeFileSync("meta/" + body.from + ".json", JSON.stringify(body.data));
  res.status(200).end();
}
