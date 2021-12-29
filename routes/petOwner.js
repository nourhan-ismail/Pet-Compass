const Router = require("express");
const petOwnerController = require("../controllers/petOwnerController");
const PetOwner = require("../models/PetOwner");
const checkPetOwnerAuth = require("../middlewares/auth");

const petOwnerRouter = Router();

//pet-owner can search for another pet-owner by their username
petOwnerRouter.get("/:petOwnerUsername", petOwnerController.getPetOwnerProfile);

//pet-owner can retrive pets of a pet-owner
petOwnerRouter.get(
  "/:petOwnerUsername/pets",
  petOwnerController.getPetOwnerPets
);

//pet-owner can add a new pet on their own profile
petOwnerRouter.post(
  "/:petOwnerUsername/pets",
  checkPetOwnerAuth,
  checkPetOwnerAuth.addPetValidator(),
  petOwnerController.addNewPet
);

//pet-owner can delete a pet he has
petOwnerRouter.delete(
  "/:petOwnerUsername/pets",
  checkPetOwnerAuth,
  petOwnerController.deletePet
);

petOwnerRouter.patch(
  "/:petOwnerUsername",
  checkPetOwnerAuth,
  (req, res,next) => checkPetOwnerAuth.updatePetOwnerProfileValidator(req, res,next),
  petOwnerController.updateProfile
);

petOwnerRouter.post(
  "/:petOwnerUsername/posts",
  checkPetOwnerAuth,
  checkPetOwnerAuth.addPostValidator(),
  petOwnerController.createPost
);

petOwnerRouter.get(
  "/:petOwnerUsername/posts",
  petOwnerController.getPetOwnerPosts
);

petOwnerRouter.delete(
  "/:petOwnerUsername/posts",
  checkPetOwnerAuth,
  petOwnerController.deletePost
);

petOwnerRouter.get("/", petOwnerController.getPetOwners);

module.exports = petOwnerRouter;
