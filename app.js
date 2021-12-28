const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');

//loading environment variables

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

//parsing
app.use(express.json());
app.use(cors());


//connecting to mongoose DB
mongoose.connect("mongodb+srv://nourhan:test123@cluster0.vbktc.mongodb.net/PetCompass?retryWrites=true&w=majority");
