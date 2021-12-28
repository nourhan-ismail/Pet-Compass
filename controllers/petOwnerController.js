const { PetOwner } = require("../models/PetOwner");

module.exports.getPetOwnerProfile = async (res, req, next) => {
    const id = req.body.id;
    let petOwner;
    try {
        petOwner = await PetOwner.findOne({})
        
    } catch (error) {
        
    }
};

module.exports.addNewPet = (req, res, next) => {
  const { petName, petType, breed, petAge, color, photoURL } = req.body;

  //const currentPets = currentPetOwner.
};
