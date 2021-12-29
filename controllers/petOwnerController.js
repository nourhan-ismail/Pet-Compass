const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
//const multer = require("multer");
const PetOwner = require("../models/PetOwner");
const multer = require("multer");

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
  const petOwnerUsername = req.username;
  const targetPetOwnerUsername = req.params.petOwnerUsername;

  if (petOwnerUsername !== targetPetOwnerUsername) {
    return res.status(401).send({
      error: "Unauthorized access"
    });
  }

  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessages = errors.map((err) => err.msg);
    return res.status(422).send({
      message: "Adding a new pet process failed, please try again later.",
      errors: errorMessages
    });
  }

  const { petName, petType, petBreed, petAge, petColor } = req.body;

  const petImage = req.file.path;

  console.log(petImage);

  let petOwner;
  //get current pet owner
  try {
    petOwner = await PetOwner.findOne({ username: petOwnerUsername });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Server error, could not add your pet."
    });
  }

  petOwner.pets.push({
    name: petName,
    type: petType,
    breed: petBreed,
    age: petAge,
    color: petColor,
    photoURL: petImage || null
  });

  try {
    await petOwner.save();
  } catch (error) {
    return res.status(500).send({
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
  const targetPetOwnerUsername = req.params.petOwnerUsername;

  if (petOwnerUsername !== targetPetOwnerUsername) {
    return res.status(401).send({
      error: "Unauthorized Access"
    });
  }
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
  const targetPetOwnerUsername = req.params.petOwnerUsername;

  if (petOwnerUsername !== targetPetOwnerUsername) {
    return res.status(401).send({
      error: "Unauthorized Access"
    });
  }
  const errors = [];

  const { name, phoneNumber, email } = req.body;

  if (name === "") {
    errors.push("Name cannot be empty.");
  }

  const phoneRegEx = /^01[0125][0-9]{8}$/;
  if (phoneNumber && !phoneNumber.match(phoneRegEx)) {
    errors.push("Invalid Phone Number.");
  }

  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !email.match(emailRegEx)) {
    errors.push("Invalid Email.");
  }

  if (errors.length > 0) {
    return res.status(422).send({
      message: "invalid input",
      errors: errors
    });
  }

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
  const targetPetOwnerUsername = req.params.petOwnerUsername;

  if (petOwnerUsername !== targetPetOwnerUsername) {
    return res.status(401).send({
      error: "Unauthorized Access"
    });
  }

  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const errorMessages = errors.map((err) => err.msg);
    return res.status(422).send({
      message: "Creating a post process failed, please try again later.",
      errors: errorMessages
    });
  }

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
    publishDate: postCreationDate,
    imageURL: req.file.path || null
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
  const targetPetOwnerUsername = req.params.petOwnerUsername;

  if (petOwnerUsername !== targetPetOwnerUsername) {
    return res.status(401).send({
      error: "Unauthorized Access"
    });
  }

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
