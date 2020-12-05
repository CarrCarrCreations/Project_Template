const router = require("express").Router();
const { Mongoose } = require("mongoose");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Validate User
  const { error } = registerValidation(req.body);
  if (error) {
    return res.send(error.details[0].message);
  }

  // Check if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.send("This email already exsits");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ userId: `${savedUser._id}` });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // Validate User
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the user is already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email is incorrect");
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Password is incorrect");
  }

  // Create and assign JWT token
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
});

module.exports = router;
