const PORT = process.env.PORT || 5000;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsoptions");
const connectDB = require('./config/dbconnect');

const app = express();

connectDB();

app.use(cors(corsOptions));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
