const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const productController = require("../controllers/product");

const router = express.Router();

router.post("/", isAuth, productController.postProduct);
router.get("/", productController.getProducts);
router.get("/single", productController.getProduct);

module.exports = router;
