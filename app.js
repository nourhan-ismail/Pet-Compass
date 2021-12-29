const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const petOwnerRouter = require("./routes/petOwner");
const { initiateDBConnection } = require("./db/db");

const path = require('path');

//loading environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

//parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));


app.use("/pet-owners", petOwnerRouter);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  initiateDBConnection();
});
