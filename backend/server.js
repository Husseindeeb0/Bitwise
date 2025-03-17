const PORT = process.env.PORT || 5000;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsoptions");
const connectDB = require('./config/dbconnect');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
