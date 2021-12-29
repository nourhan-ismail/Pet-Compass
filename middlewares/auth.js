const axios = require("axios");
const { check } = require("express-validator");
const phoneRegEx = /^01[0125][0-9]{8}$/;

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
    console.log("error: " + error);
    res.status(403).json({ error: "Authentication Failed" });
  }

  petOwnerUsername = response.data.username;

  req.username = petOwnerUsername;
  next();
};

//adding a pet
module.exports.addPetValidator = () => [
  check("petName")
    .notEmpty()
    .withMessage("Pet name cannot be empty.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Invalid pet name"),
  check("petType").notEmpty().withMessage("Pet type cannot be empty"),
];

//updating profile
module.exports.updatePetOwnerProfileValidator = (req, res,next) => {
  const validators = [];
  if (req.name) {
    validators.push(
      check("name").notEmpty().withMessage("Name cannot be empty")
    );
  }
  if (req.phone) {
    validators.push(
      check("phone").matches(phoneRegEx).withMessage("Invalid phone number")
    );
  }
  if (req.email) {
    validators.push(check("email").isEmail().withMessage("Invalid Email"));
  }
  next();
  return validators;
};
//put a limit on caption when adding a post
module.exports.addPostValidator = () => [
  check("body").notEmpty().withMessage("Post body cannot be empty"),
];
