const Router = require("express");
const petOwnerController = require("../controllers/petOwnerController");
const PetOwner = require("../models/PetOwner");

const petOwnerRouter = Router();

//pet-owner can search for another pet-owner by their username
petOwnerRouter.get('/:petOwnerId',petOwnerController.getPetOwnerProfile);

//pet-owner can retrive pets of another pet-owner

//pet-owner can retrive posts of another pet-owner

//pet-owner can add a post on their own profile

//pet-owner can add a new pet on their own profile
petOwnerRouter.post("/", petOwnerController.addNewPet);

module.exports = petOwnerRouter;
