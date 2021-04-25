const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Enter a valid data!");
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Email or password is not correct!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: loadedUser._id.toString(),
          email: loadedUser.email,
          name: loadedUser.name,
          phoneNumber: loadedUser.phoneNumber,
          age: loadedUser.age,
        },
        process.env.SECRET,
        { expiresIn: "500h" }
      );

      res.status(200).json({
        loginSuccess: true,
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    error.message = error.data[0].msg;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const age = req.body.age;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
        age: age,
        phoneNumber: phoneNumber,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.message.includes("index: phoneNumber_1 dup"))
        err.message = "Phone number already exist!";

      next(err);
    });
};

exports.updateUserInfo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    error.message = error.data[0].msg;
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const userId = req.userId;

  User.findById(userId)
    .then(async (users) => {
      if (!users) {
        const error = new Error("Could not find users.");
        error.statusCode = 404;
        throw error;
      }

      let hashedPw;

      try {
        hashedPw = await bcrypt.hash(password, 12);
      } catch (err) {}
      users.email = email || users.email;
      users.name = name || users.name;
      users.phoneNumber = phoneNumber || users.phoneNumber;
      users.password = hashedPw || users.password;

      return users.save();
    })
    .then((result) => {
      const token = User.generateToken(result)
      res.status(200).json({ message: "user profile updated!", token: token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.message.includes("ndex: email_1 dup"))
        err.message = "Email already exists!";
      else if (err.message.includes("index: phoneNumber_1 dup"))
        err.message = "Phone number already exist!";
      next(err);
    });
};

