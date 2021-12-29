const Router = require("express");
const petOwnerRouter = Router();

const petOwnerController = require("../controllers/petOwnerController");
const PetOwner = require("../models/PetOwner");
const checkPetOwnerAuth = require("../middlewares/auth");
const checkPetOwnerValidator = require("../middlewares/PetOwnerValidators");


//parse incoming form bodies
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
//folder that multer will try to store the incoming files,passing a configuration
//const upload = multer({ storage: storage });



//specifying how file gets stored
/*const storage = multer.diskStorage({
  //where the incoming file should be stored
destination: function(req,file,cb){
cb(null,'./uploads');
},filename: function(req,file,cb){
  cb(null, new Date().toISOString() + file.originalname);
}
})*/


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
  checkPetOwnerValidator.addPetValidator(),upload.single('petImage'),
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

module.exports = petOwnerRouter;
