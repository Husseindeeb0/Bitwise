const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsoptions");
const connectDB = require("./config/dbconnect");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const announcementsRoutes = require("./routes/announcementsRoutes");
const coursesRoutes = require("./routes/coursesRoutes");

dotenv.config();

const app = express();
connectDB();

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/announcements", announcementsRoutes);
app.use("/courses", coursesRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started on port ${PORT}`)
);
