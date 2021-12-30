const Router = require("express");
const petOwnerRouter = Router();

const petOwnerController = require("../controllers/petOwnerController");
const PetOwner = require("../models/PetOwner");
const checkPetOwnerAuth = require("../middlewares/auth");
const checkPetOwnerValidator = require("../middlewares/PetOwnerValidators");

const fileUpload = require("../middlewares/imageUpload");

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
  fileUpload.single("petImage"),
  checkPetOwnerValidator.addPetValidator(),
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
  petOwnerController.updateProfile
);

petOwnerRouter.post(
  "/:petOwnerUsername/posts",
  checkPetOwnerAuth,
  fileUpload.single("imageURL"),
  checkPetOwnerValidator.addPostValidator(),
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

//get nearby vets

petOwnerRouter.get("/nearby-vets",checkPetOwnerAuth,petOwnerController.getNearbyVets);

module.exports = petOwnerRouter;
