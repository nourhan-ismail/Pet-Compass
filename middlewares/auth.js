const axios = require("axios");


module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let petOwnerUsername;
  const token = req.headers.authorization.split(" ")[1];
  let response;
  try {
    response = await axios.get("http://localhost:4000/auth", {
      headers: {
        Authorization: `BEARER ${token}`,
      },
    });
  } catch (error) {
    return res.status(403).json({ error: "Authentication Failed" });
  }

  petOwnerUsername = response.data.username;

  req.username = petOwnerUsername;
  next();
};


