const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const moment = require("moment");

//User Model

const User = require("../../models/User");
const Product = require('../../models/Product')
//@route POST api/auth/login
//@desc   Auth user
//@access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check for existing user
    User.findOne({ email }).then(user => {
      if (!user) return res.status(400).json({ msg: "User does not exists" });

      //Validate password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res.status(400).json({ msg: "Invalid credentials" });
        jwt.sign(
          { _id: user._id },
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              user: {
                _id: user._id,
                isAdmin: user.role === 0 ? false : true,
                name: user.name,
                email: user.email,
                role: user.role,
                cart: user.cart,
                history: user.history
              },
              token:token,
              loginSuccess: true
            });
          }
        );
      });
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//@route  POST api/auth/register
//@desc   Register new user
//@access Public

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  // Simple validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter the fields", success: false });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user)
      return res
        .status(400)
        .json({ msg: "User already exists", success: false });
    const newUser = new User(req.body);

    //Create salt& hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign(
            { _id: user._id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email, 
                },
                token: token,
                registerSuccess: true
              });
            }
          );
        });
      });
    });
  });
});

//@route  GET api/auth/user
//@desc   Get user data
//@access Private
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) throw Error("User Does not exist");
    // try to add some detail
    // res.json(user);
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});



router.post("/addToCart",auth, (req, res) => {
  
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let duplicate = false;

    userInfo.cart.forEach(cartInfo => {
      if (cartInfo.id === req.query.productId) {
        duplicate = true;
      }
    });
    if (duplicate) {
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cart.id": req.query.productId
        },
        {
          $inc: { "cart.$.quantity": 1 }
        },
        {
          new: true
        },
        (err,userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.query.productId,
              quantity: 1,
              date: Date.now()
            }
          }
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    }
  });
});

router.get('/removeFromCart',auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id},{"$pull":{"cart":{"id":req.query._id}}},{new:true},(err,userInfo)=>{
    let cart = userInfo.cart;
    let array = cart.map(item=>{
      return item.id
    })
    Product.find({'_id':{$in:array}}).exec((err,cartDetail)=>{
      return res.status(200).json({cartDetail,cart})
    })
  })
})

module.exports = router;
