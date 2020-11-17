// Import express module
var express = require("express");

// Import path module
var path = require("path");

// Import logger module
var logger = require("morgan");

// Import model module
var model = require("./model/model");

// Support cookie parser
var cookieParser = require("cookie-parser");

// Instantiate the express middleware
var app = express();

// Suport JSON object parsing
app.use(express.json());
// Support nested JSON object parsing (for more than 2 levels!)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Load logger module
app.use(logger("dev"));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname, "public")));

// HTTP GET /api/products
// Returns all products
app.get("/api/products", function (req, res, next) {
  return res.json(model.products);
});

// HTTP POST /api/users/signin
app.post("/api/users/signin", function (req, res, next) {
  var user = model.signin(req.body.email, req.body.password);
  if (user) {
    res.cookie("userid", user._id);
    return res.json(user);
  } else return res.status(401).send({ message: "Invalid email or password" });
});

// HTTP GET /api/cart/qty
app.get("/api/cart/qty", function (req, res, next) {
  var userid = req.cookies.userid;
  if (!userid)
    return res.status(401).send({ message: "User has not signed in" });
  var userCartQty = model.getUserCartQty(userid);
  if (userCartQty) return res.json(userCartQty);
  else
    return res
      .status(500)
      .send({ message: "Cannot retrieve user cart quantity" });
});

// HTTP POST /api/cart/items/product/:id
// Add item with :id to the cart
app.post("/api/cart/items/product/:id", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  var cart = Model.buy(uid, pid);
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User or Product not found" });
});

// HTTP GET /api/cart
app.get("/api/cart", function (req, res, next) {
  var uid = req.cookies.userid;
  var cart = Model.getCartByUserId(uid);
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User shopping cart not found" });
});

app.delete("/api/cart/items/product/:id/one", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  var cart = Model.removeOne(uid, pid);
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User or Product not found" });
});

// Redirect request to index.html file
app.get(/\/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Adds the / path to the application
app.get("/", function (req, res) {
  // Sends the Hello World string back to the client
  res.send(`
<html>
    <head>
        <title>Book Shop</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`);
});

// Listen to port 3000
app.listen(3000, function () {
  console.log("BookShop WebApp listening on port 3000!");
});
