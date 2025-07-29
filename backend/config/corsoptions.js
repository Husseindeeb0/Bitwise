const allowedOrigins = [
  "https://bitwiseclub.com",
  "https://frontend-service-261191369874.us-central1.run.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://bitwise0.netlify.app",
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
