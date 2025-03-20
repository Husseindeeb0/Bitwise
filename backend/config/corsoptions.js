const allowedOrigins = [
  "http://localhost:5173",
  "https://bitwise0.netlify.app/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"],
};

module.exports = corsOptions;