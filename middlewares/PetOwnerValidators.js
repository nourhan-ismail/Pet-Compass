const {check} = require('express-validator');

//adding a pet
module.exports.addPetValidator = () => [
    check("petName")
      .not().isEmpty()
      .isLength({ min: 1, max: 20 })
      .withMessage("Invalid pet name"),
    check("petType").notEmpty().withMessage("Pet type cannot be empty"),
  ];
  
  //put a limit on caption when adding a post
  module.exports.addPostValidator = () => [
    check("body").notEmpty().withMessage("Post body cannot be empty"),
  ];