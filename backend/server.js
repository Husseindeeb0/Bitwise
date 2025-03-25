const PORT = process.env.PORT || 5000;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsoptions");
const connectDB = require("./config/dbconnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
