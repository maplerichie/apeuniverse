import Cors from "cors";

var whitelist = [
  "http://localhost:4000",
  "https://apeuniverse.xyz",
  "https://www.apeuniverse.xyz",
];

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        const origin = req.headers.origin;
        const host = req.headers.host;
        if (origin === undefined) {
          if (host !== "localhost:4000" && req.headers["api-key"] !== "apepy") {
            return reject("403 Forbidden");
          }
        } else {
          if (whitelist.indexOf(origin) < 0) {
            return reject("403 Forbidden");
          }
        }
        // if (whitelist.indexOf(req.header('Origin')) !== -1) {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const cors = initMiddleware(
  Cors({
    methods: ["GET", "PUT", "POST"],
  })
);
