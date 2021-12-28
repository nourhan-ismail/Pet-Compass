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
  const { petName, petType, petBreed, petAge, petColor } = req.body;

  const petOwnerUsername = req.username;

  let petOwner;
  //get current pet owner
  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Server error, could not add you pet."
    });
  }

  petOwner.pets.push({
    name: petName,
    type: petType,
    breed: petBreed,
    age: petAge,
    color: petColor
  });

  try {
    await petOwner.save();
  } catch (error) {
    res.status(500).send({
      error: "Server error, could not add you pet."
    });
  }

  res.send({
    message: "Pet added successfully."
  });
};
