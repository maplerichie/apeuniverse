const jwt = require("jsonwebtoken");

export const signJwt = async (id, address) => {
  const token = jwt.sign(
    { user_id: id, address: address },
    process.env.TOKEN_KEY,
    {
      expiresIn: "3h",
    }
  );
  return token;
};

export const verifyJwt = async (token, address) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded.address == address;
  } catch (_) {
    return false;
  }
};
