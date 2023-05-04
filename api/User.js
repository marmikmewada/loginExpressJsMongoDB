const express = require("express");

//using express router to use routing files in our main index.js
const router = express.Router();
//adding bcrypt
const bcrypt = require("bcrypt");
// mongo db user model

const User = require("../models/User");

//sign up
router.post("/signup", async (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "empty input fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "invalid name entered",
    });
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "invalid email entered",
    });
  } else if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`|}{[\]:;?/<>,.]).{8}/.test(
      password
    )
  ) {
    res.json({
      status: "FAILED",
      message:
        "password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
    res.json({
      status: "FAILED",
      message:
        "invalid date of birth entered. Please enter the date of birth in the format YYYY-MM-DD.",
    });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "user already exists",
          });
        } else {
          // try create new user

          //password hashing
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
              });
              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "User successfully created",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "Errr",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Errr",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "an error has occured",
        });
      });
  }
});

//sign in
//sign in
router.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "empty input fields",
    });
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "invalid email entered",
    });
  } else if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`|}{[\]:;?/<>,.]).{8}/.test(
      password
    )
  ) {
    res.json({
      status: "FAILED",
      message:
        "invalid password entered. Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  } else {
    // TODO: check if email and password are valid in the database and log the user in
    res.json({
      status: "SUCCESS",
      message: "user logged in",
    });
  }
});

module.exports = router;
