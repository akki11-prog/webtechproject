const express = require("express");

const isAuth = require("../middleware/is-auth");

const shopController = require("../controllers/shop");
const router = express.Router();

router.post("/favItems", isAuth, shopController.postFav);
router.get("/favItems", isAuth, shopController.getFavItems);

module.exports = router;
