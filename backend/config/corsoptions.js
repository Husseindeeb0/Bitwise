const allowedOrigins = [
  "https://bitwiseclub.com",
  "https://bitwiseclub-frontend.onrender.com",
  "https://bitwiseclub-frontend-alt5.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => { 
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { 
      callback(null, true); 
    } else {
      console.log("Rejected origin:", origin);
      callback(new Error("Not allowed by CORS")); 
    } 
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"],
};

module.exports = corsOptions;
