const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Inject environmental variables
dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to mongoDB")
);

// Middleware
app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
