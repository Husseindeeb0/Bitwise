const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsoptions");
const connectDB = require("./config/dbconnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const announcementsRoutes = require("./routes/announcementsRoutes");

dotenv.config();

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/announcements", announcementsRoutes);

app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));