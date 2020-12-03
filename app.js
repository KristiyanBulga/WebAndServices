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

// HTTP POST /api/users/signin
// Tries to sign in the user
app.post("/api/users/signin", function (req, res, next) {
  var user = model.signin(req.body.email, req.body.password);
  if (user) {
    res.cookie("userid", user._id);
    return res.json(user);
  } else return res.status(401).send({ message: "Invalid email or password" });
});

// HTTP POST /api/users/signup
// Tries to sign up a new user
app.post("/api/users/signup", function (req, res, next) {
  var user = model.signup(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.surname,
    req.body.birth,
    req.body.address
  );
  if (user) {
    res.cookie("userid", user._id);
    return res.json(user);
  } else return res.status(401).send({ message: "Email already exists!" });
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

// HTTP POST /api/orders
// Add a new order using the data in the shopping cart
app.post("/api/orders", function (req, res, next) {
  var uid = req.cookies.userid;
  var cart = Model.purchase(
    uid,
    req.body.date,
    req.body.address,
    req.body.cardNumber,
    req.body.cardHolder
  );
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User not found" });
});

// HTTP GET /api/products
// Obtains all products
app.get("/api/products", function (req, res, next) {
  return res.json(model.products);
});

// HTTP GET /api/cart/qty
// Obtains the user's shopping cart quantity
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

// HTTP GET /api/cart
// Obtains the user's shopping cart
app.get("/api/cart", function (req, res, next) {
  var uid = req.cookies.userid;
  var cart = Model.getCartByUserId(uid);
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User shopping cart not found" });
});

// HTTP GET /api/users/profile
// Obtains the user's profile by id
app.get("/api/users/profile", function (req, res, next) {
  var uid = req.cookies.userid;
  var profile = Model.getProfileByUserId(uid);
  if (profile) {
    return res.json(profile);
  } else return res.status(401).send({ message: "User not found" });
});

// HTTP GET /api/users/profile
// Obtains the user's orders
app.get("/api/orders", function (req, res, next) {
  var uid = req.cookies.userid;
  var orders = Model.getOrdersByUserId(uid);
  if (orders) {
    return res.json(orders);
  } else return res.status(401).send({ message: "Orders not found" });
});

// HTTP GET /api/orders/id/:id
// Obtain the order with :id 
app.get("/api/orders/id/:id", function (req, res, next) {
  var oid = req.params.id;
  var uid = req.cookies.userid;
  var order = Model.getOrder(uid, oid);
  if (order) {
    return res.json(order);
  } else return res.status(401).send({ message: "User or Order not found" });
});

// HTTP DELETE /api/cart/items/product/:id/one
// Removes one item of a product type from the user's shopping cart
app.delete("/api/cart/items/product/:id/one", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  var cart = Model.removeOne(uid, pid);
  if (cart) {
    return res.json(cart);
  } else return res.status(401).send({ message: "User or Product not found" });
});

// HTTP DELETE /api/cart/items/product/:id/all
// Removes a product type from the user's shopping cart
app.delete("/api/cart/items/product/:id/all", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  var cart = Model.removeAll(uid, pid);
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
