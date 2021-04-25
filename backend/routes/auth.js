const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
    body("age").trim().not().isEmpty(),
    body("phoneNumber").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .not()
      .isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.login
);

router.put("/user",isAuth, authController.updateUserInfo);

module.exports = router;
