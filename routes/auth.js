const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// Register
router.post("/register", async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });
  
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.error("Registration error:", err); // Log the error
      res.status(500).json({ message: "An error occurred during registration." });
    }
  });
  
  // Log-in
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        return res.status(401).json("Wrong Credentials");
      }
  
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  
      if (OriginalPassword !== req.body.password) {
        return res.status(401).json("Wrong Credentials");
      }
  
      // Use isAdmin from user schema (if applicable)
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin, // Assuming isAdmin exists in your schema
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );
  
      // Exclude the password in the response
      const { password, ...others } = user._doc;
  
      res.status(200).json({ ...others, accessToken });
    } catch (err) {
      console.error("Login error:", err); // Log the error
      res.status(500).json({ message: "An error occurred during login." });
    }
  });
  
  module.exports = router;