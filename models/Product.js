const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: 50
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ""
    },
    imagePath: {
      type: String,
      default: ""
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

productSchema.index(
  {
    title: "text",
    description: "text"
  },
  {
    weights: {
      name: 5,
      description: 1
    }
  }
);

module.exports = Product = mongoose.model("product", productSchema);
