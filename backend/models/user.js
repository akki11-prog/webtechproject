const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: 1,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: 1,
    },
    favItems: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.generateToken = function (user) {
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      age: user.age,
    },
    process.env.SECRET,
    { expiresIn: "500h" }
  );



  return token;
};

userSchema.methods.addToFav = function (product) {
  const favItemIndex = this.favItems.items.findIndex((fp) => {
    return fp.productId.toString() === product._id.toString();
  });
  const updatedFavItems = [...this.favItems.items];

  if (favItemIndex >= 0) {
    updatedFavItems.splice(favItemIndex, 1);
  } else {
    updatedFavItems.unshift({
      productId: product._id,
    });
  }
  const favItems = {
    items: updatedFavItems,
  };
  this.favItems = favItems;
  return this.save();
};


userSchema.statics.getFavItems = async function (id) {
  try {
    return this.aggregate([
      { $match: { _id: ObjectId(id) } },
      { $unwind: "$favItems.items" },
      {
        $lookup: {
          from: "products",
          localField: "favItems.items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "users",
          localField: "product.creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: "$creator" },
    ]);
  } catch (error) {
    throw error;
  }
};


module.exports = mongoose.model("User", userSchema);
