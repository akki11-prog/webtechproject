const Product = require("../models/product");
const User = require("../models/user");

exports.postFav = (req, res, next) => {
  const prodId = req.body.productId;
  User.findById(req.userId).then((user) => {
    Product.findById(prodId)
      .then((product) => {
        return user.addToFav(product);
      })
      .then((result) => {
        return res.status(200).json({ message: "product added successfully" });
      });
  });
};

exports.getFavItems = (req, res, next) => {
  User.getFavItems(req.userId)
    .then((result) => {
      return res.status(200).json({ result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
