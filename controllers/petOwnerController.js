const mongoose = require("mongoose");

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
    res.status(422).json({ error: "Could not find pet owner" });
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

module.exports.getPetOwnerPets = async (req, res, next) => {
  const petOwnerUsername = req.params.petOwnerUsername;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  res.send(petOwner.pets);
};

module.exports.deletePet = async (req, res, next) => {
  const petOwnerUsername = req.username;
  const { petID } = req.body;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  if (
    petOwner.pets.some((pet) =>
      pet._id.equals(mongoose.Types.ObjectId(petID))
    ) === false
  ) {
    return res.status(422).send({
      error: "Could not find pet."
    });
  }

  petOwner.pets = petOwner.pets.filter(
    (pet) => !pet._id.equals(mongoose.Types.ObjectId(petID))
  );

  try {
    await petOwner.save();
  } catch (error) {
    res.status(500).send({
      error: "Server error, could not delete your pet."
    });
  }

  res.send({
    message: "Pet removed successfully.",
    updatedPets: petOwner.pets
  });
};

module.exports.updateProfile = async (req, res, next) => {
  const petOwnerUsername = req.username;

  const { name, phoneNumber, email } = req.body;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  petOwner.name = name || petOwner.name;
  petOwner.phone = phoneNumber || petOwner.phoneNumber;
  petOwner.email = email || petOwner.email;

  try {
    await petOwner.save();
  } catch (error) {
    res.status(500).send({
      error: "Server error, could not update your profile."
    });
  }

  res.send({
    message: "Profile updated successfully.",
    updatedProfile: petOwner
  });
};

module.exports.createPost = async (req, res, next) => {
  const petOwnerUsername = req.username;

  const { body } = req.body;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  const postCreationDate = Date.now();

  petOwner.posts.push({
    body,
    publishDate: postCreationDate
  });

  try {
    await petOwner.save();
  } catch (error) {
    res.status(500).send({
      error: "Server error, could not create your post."
    });
  }

  res.send({
    message: "Post created successfully.",
    posts: petOwner.posts
  });
};

module.exports.getPetOwnerPosts = async (req, res, next) => {
  const petOwnerUsername = req.params.petOwnerUsername;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  res.send({
    posts: petOwner.posts
  });
};

module.exports.deletePost = async (req, res, next) => {
  const petOwnerUsername = req.username;
  const { postID } = req.body;

  let petOwner;

  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.error(err);
    res.status(422).json({ error: "Could not find pet owner" });
  }

  if (
    petOwner.posts.some((post) =>
      post._id.equals(mongoose.Types.ObjectId(postID))
    ) === false
  ) {
    return res.status(422).send({
      error: "Could not find post."
    });
  }

  petOwner.posts = petOwner.posts.filter(
    (post) => !post._id.equals(mongoose.Types.ObjectId(postID))
  );

  try {
    await petOwner.save();
  } catch (error) {
    res.status(500).send({
      error: "Server error, could not delete your post."
    });
  }

  res.send({
    message: "Post removed successfully.",
    updatedPosts: petOwner.posts
  });
};

module.exports.getPetOwners = async (req, res, next) => {
  const { petType, petBreed } = req.query;

  console.log(req.query);

  let petOwners;
  if (petType || petBreed) {
    petOwners = await PetOwner.find({
      $or: [{ "pets.type": petType }, { "pets.breed": petBreed }]
    });
    try {
    } catch (error) {
      res.status(422).json({ error: "Could not find pet owners" });
    }
  } else {
    petOwners = await PetOwner.find();
    try {
    } catch (error) {
      res.status(422).json({ error: "Could not find pet owners" });
    }
  }

  res.send({
    petOwners: petOwners
  });
};
