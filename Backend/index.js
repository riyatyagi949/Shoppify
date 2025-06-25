require("dotenv").config();

const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.BACK_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


// Test route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image storage engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Static route to access uploaded images
app.use('/images', express.static('upload/images'));

// Upload route
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    imageUrl: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add Product Route
app.post('/addproduct', async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove Product Route
app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, message: "Product removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove product" });
  }
});

// Get All Products Route
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// User Schema
const Users = mongoose.model('Users', {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Signup Route (Updated)
app.post('/signup', async (req, res) => {
  try {
    const existingUser = await Users.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
    }

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: {}, // Empty cart
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Wrong Email Id" });
    }

    if (req.body.password !== user.password) {
      return res.status(401).json({ success: false, message: "Wrong Password" });
    }

    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get New Collection
app.get('/newcollection', async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
  } catch (err) {
    console.error("Error fetching new collection:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get Popular in Women Section
app.get('/popularinwomen', async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    res.status(200).send(popular_in_women);
  } catch (err) {
    console.error("Error fetching popular women products:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Middleware to fetch user from token
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

// Add to Cart Route
app.post('/addtocart', fetchUser, async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ success: false, message: "itemId is required" });
  }

  try {
    const userId = req.user.id;
    const updateField = `cartData.${itemId}`;

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { $inc: { [updateField]: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Item ${itemId} added to cart`,
      cartData: updatedUser.cartData,
    });

  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove from Cart Route (Updated)
app.post("/removefromcart", fetchUser, async (req, res) => {
  const itemId = req.body.itemId.toString();

  try {
    const user = await Users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.cartData[itemId] && user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;

      if (user.cartData[itemId] <= 0) {
        delete user.cartData[itemId];
      }

      user.markModified('cartData');
      await user.save();

      return res.status(200).json({ success: true, cartData: user.cartData });
    } else {
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

  } catch (err) {
    console.error("Error in removefromcart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// OPTIONAL: Cleanup Endpoint (Run Once)
app.get('/cleanup-cartdata', async (req, res) => {
  try {
    const users = await Users.find();
    for (let user of users) {
      let cart = user.cartData || {};
      for (let key in cart) {
        if (cart[key] === 0) {
          delete cart[key];
        }
      }
      user.cartData = cart;
      user.markModified('cartData');
      await user.save();
    }
    res.send({ success: true, message: "All cartData cleaned" });
  } catch (err) {
    console.error("Cleanup Error:", err);
    res.status(500).send({ success: false, message: "Failed to clean cartData" });
  }
});

// Creating Endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})

// Newsletter Schema and Model
const Newsletter = mongoose.model('Newsletter', {
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Newsletter subscription endpoint
app.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Check if already subscribed
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already subscribed' });
    }

    const newSub = new Newsletter({ email });
    await newSub.save();

    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Sample valid promo codes (you can expand or fetch from DB)
const validPromoCodes = {
  "DISCOUNT10": 10,   
  // 10% discount (you can use it for backend discount logic)
  "FREESHIP": 0,
  "WELCOME5": 5
};

app.post("/validate-promo", (req, res) => {
  const { promoCode } = req.body;
  if (!promoCode) {
    return res.status(400).json({ success: false, message: "Promo code is required" });
  }

  const upperCode = promoCode.toUpperCase();
  if (validPromoCodes.hasOwnProperty(upperCode)) {
    // Promo code is valid
    return res.status(200).json({ success: true, message: "Promo code applied", discount: validPromoCodes[upperCode] });
  } else {
    // Invalid promo code
    return res.status(400).json({ success: false, message: "Invalid promo code" });
  }
});


// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});



