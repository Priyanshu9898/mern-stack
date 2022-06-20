const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

require("../DB/conn");

const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("Hello world from server router.js!");
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    const response = await User.findOne({ email: email });

    if (!response) {
      return res.status(400).json({
        status: "fail",
        error: "User not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, response.password);

      token = await response.generateAuthToken();

      console.log(token);
      res.cookie("Jwt-token", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (isMatch) {
        return res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          data: response,
        });
      } else {
        return res.status(400).json({
          status: "fail",
          error: "Invalid Credentials",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({
      status: "fail",
      message: "Please fill all the fields",
    });
  } else if (password !== cpassword) {
    return res.status(422).json({
      status: "fail",
      message: "Password and Confirm Password does not match",
    });
  }

  // Using async/await
  try {
    const response = await User.findOne({ email: email });

    if (response) {
      return res.status(422).json({
        status: "fail",
        message: "User already exists",
      });
    }

    const user = new User({ name, email, phone, work, password, cpassword });

    const userRegister = await user.save();

    if (userRegister) {
      return res.status(200).json({
        status: "success",
        message: "User registered successfully",
      });
    } else {
      return res.status(422).json({
        status: "fail",
        message: "Failed to registered",
      });
    }
  } catch (err) {
    console.log(err);
  }

  //   Using Promises

  //   User.findOne({ email: email });
  // .then((userExist) => {
  //   if (userExist) {
  //     return res.status(422).json({
  //       status: "fail",
  //       message: "User already exists",
  //     });
  //   }

  //   const user = new User({ name, email, phone, work, password, cpassword });

  //   user
  //     .save()
  //     .then(() => {
  //       res.status(201).json({
  //         status: "success",
  //         message: "User created successfully",
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({
  //         status: "fail",
  //         message: "Failed to Register",
  //       });
  //     });
  // })
  // .catch((err) => {
  //   res.status(500).json({
  //     status: "fail",
  //     message: "Something went wrong",
  //   });
  // });
});

module.exports = router;
