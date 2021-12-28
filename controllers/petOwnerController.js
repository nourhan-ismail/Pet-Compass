const PetOwner = require("../models/PetOwner");

//get specific pet owner profile

module.exports.getPetOwnerProfile = async (req, res, next) => {
  const petOwnerUsername = req.params.petOwnerUsername;
  try {
    let petOwner = await PetOwner.findOne({ username: petOwnerUsername });
    console.log(petOwner);
    res.status(200).json(petOwner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

module.exports.addNewPet = async (req, res, next) => {
  const { petName, petType, breed, petAge, color, photoURL } = req.body;
  let petOwner;
  //get current pet owner
  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
    
  } catch (error) {}

  //get pets of this pet owner
  //add pet to the list of pets
};
