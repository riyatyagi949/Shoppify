require("dotenv").config();
console.log("Mongo URI:", process.env.BACK_URL);

const port = process.env.PORT || 4001;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.BACK_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// Test route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Upload route using Cloudinary
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  res.json({
    success: 1,
    imageUrl: req.file.path,
  });
});

// Schemas
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
});

const Newsletter = mongoose.model("Newsletter", {
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Product Routes
app.post('/addproduct', async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({ id, ...req.body });
    await product.save();
    res.json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, message: "Product removed" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to remove product" });
  }
});

app.get('/allproducts', async (_, res) => {
  const products = await Product.find({});
  res.send(products);
});

// Auth Routes
app.post('/signup', async (req, res) => {
  try {
    const exists = await Users.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: {},
    });

    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    res.status(200).json({ success: true, message: "User registered", token });
  } catch {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user || req.body.password !== user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    res.status(200).json({ success: true, token });
  } catch {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Product Views
app.get('/newcollection', async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get('/popularinwomen', async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    res.status(200).send(products.slice(0, 4));
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Middleware for auth
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ error: "Authentication required" });

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
};

// Cart APIs
app.post('/addtocart', fetchUser, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ success: false, message: "itemId is required" });

  try {
    const updateField = `cartData.${itemId}`;
    const user = await Users.findOneAndUpdate(
      { _id: req.user.id },
      { $inc: { [updateField]: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Item added", cartData: user.cartData });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const itemId = req.body.itemId.toString();

  try {
    const user = await Users.findById(req.user.id);
    if (!user || !user.cartData[itemId]) {
      return res.status(400).json({ success: false, message: "Item not found" });
    }

    user.cartData[itemId] -= 1;
    if (user.cartData[itemId] <= 0) delete user.cartData[itemId];

    user.markModified("cartData");
    await user.save();

    res.status(200).json({ success: true, cartData: user.cartData });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

// Newsletter Route
app.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already subscribed' });
    }

    await new Newsletter({ email }).save();
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Promo Code Validator
const validPromoCodes = {
  "DISCOUNT10": 10,
  "FREESHIP": 0,
  "WELCOME5": 5
};

app.post("/validate-promo", (req, res) => {
  const code = req.body.promoCode?.toUpperCase();
  if (!code || !validPromoCodes.hasOwnProperty(code)) {
    return res.status(400).json({ success: false, message: "Invalid promo code" });
  }
  res.status(200).json({ success: true, message: "Promo applied", discount: validPromoCodes[code] });
});

// Start Server
app.listen(port, (err) => {
  if (!err) console.log("Server Running on Port " + port);
  else console.log("Error: " + err);
});

