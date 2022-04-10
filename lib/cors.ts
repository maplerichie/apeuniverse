import Cors from "cors";

var originWl = [
  "http://localhost:4000",
  "http://127.0.0.1:4000",
  "https://apeuniverse.xyz",
  "https://www.apeuniverse.xyz",
];

var hostWl = [
  "localhost:4000",
  "127.0.0.1:4000",
  "apeuniverse.xyz",
  "www.apeuniverse.xyz",
];

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        const origin = req.headers.origin;
        const host = req.headers.host;
        if (origin === undefined) {
          if (hostWl.indexOf(host) < 0 && req.headers["api-key"] !== "apepy") {
            return reject("403 Forbidden");
          }
        } else {
          if (originWl.indexOf(origin) < 0) {
            return reject("403 Forbidden");
          }
        }
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
