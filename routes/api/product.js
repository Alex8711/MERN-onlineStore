const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");
const fileUpload = require("express-fileupload");

router.post("/uploadImage", auth, (req, res) => {
  //after getting that image from client
  //we need to save it inside Node Server
  // upload(req, res, err => {
  //   if (err) return res.json({ success: false, err });
  //   return res.json({
  //     success: true,
  //     image: res.req.file.path,
  //     fileName: res.req.file.filename
  //   });
  // });
  if (req.files === null) {
    return res.status(400).json({ success: false, msg: "No image uploaded" });
  }

  const file = req.files.file;

  file.mv(`./client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({
      success: true,
      image: file.name,
      filePath: `/uploads/${file.name}`
    });
  });
});

router.post("/uploadProduct", auth, (req, res) => {
  //save all the data
  const product = new Product(req.body);
  product.save(err => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/getProducts", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  Product.find()
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, products });
    });
});

router.get("/products_by_id", (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;
  if (type === "array") {
    let ids = req.query.id.split(",");
    productIds = [];
    productIds = ids.map(item => {
      return item;
    });
  }
  Product.find({ "_id": { $in: productIds } }).exec((err, product) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(product);
  });
});

module.exports = router;
