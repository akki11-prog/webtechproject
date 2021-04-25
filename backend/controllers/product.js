const Product = require("../models/product");
// const User = require("../models/user");

exports.postProduct = (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;

  const product = new Product({
    name: name,
    price: price,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({ message: "Product created", product: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("creator");

    res.status(200).json({
      message: "Fetched posts successfully.",
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProduct = (req, res, next) => {
  const productName = req.query.name;
  if(!productName){
    Product.find().populate("creator")
      .then((product) => {
        if (!product) {
          const error = new Error("Could not find products");
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: "product fetched.", product: product });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }else {

    Product.find({ name: productName }).populate("creator")
      .then((product) => {
        if (!product) {
          const error = new Error("Could not find product.");
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: "product fetched.", product: product });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
