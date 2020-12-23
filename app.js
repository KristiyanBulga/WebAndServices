const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const secretKey = "your_jwt_secret";
const bcryptjs = require("bcryptjs");
const User = require("./model/user");
const jwt = require("jsonwebtoken");

// Import moongose
var mongoose = require("mongoose");

var uri = "mongodb://localhost/bookshop";
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on("connecting", function () {
  console.log("Connecting to ", uri);
});
db.on("connected", function () {
  console.log("Connected to ", uri);
});
db.on("disconnecting", function () {
  console.log("Disconnecting from ", uri);
});
db.on("disconnected", function () {
  console.log("Disconnected from ", uri);
});
db.on("error", function (err) {
  console.error("Error ", err.message);
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, cb) {
      return User.findOne({ email })
        .select("email password name surname")
        .then(function (user) {
          if (!user) {
            return cb({ message: "Email not found" }, false);
          }
          if (!bcryptjs.compareSync(password, user.password)) {
            return cb({ message: "Incorrect password" }, false);
          }
          return cb(null, user);
        })
        .catch(function (err) {
          console.error("ERR STGY", err);
          cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    function (jwtPayload, cb) {
      return cb(null, { _id: jwtPayload.id });
    }
  )
);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  return passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err || !user) {
        console.error(err, user);
        return res.status(401).json(err);
      }
      return req.logIn(user, { session: false }, function (err) {
        if (err) {
          res.status(401).send(err);
        }
        useridFromToken(req, res);
        return res.json(user);
      });
    }
  )(req, res);
});

function useridFromToken(req, res) {
  if (req.user) {
    res.cookie(
      "token",
      jwt.sign({ id: req.user._id }, secretKey, { expiresIn: 20 })
    );
    return req.user._id;
  } else {
    res.cookie.removeOne("token");
    return null;
  }
}

// HTTP POST /api/users/signup
// Tries to sign up a new user
app.post("/api/users/signup", function (req, res, next) {
  return model
    .signup(
      req.body.name,
      req.body.surname,
      req.body.address,
      req.body.birth,
      req.body.email,
      req.body.password
    )
    .then(function (user) {
      if (user) return res.json(user);
      else return res.status(401).send({ message: "Invalid email" });
    });
});

// HTTP POST /api/cart/items/product/:id
// Add item with :id to the cart
app.post("/api/cart/items/product/:id", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  return Model.buy(uid, pid).then(function (cart) {
    if (cart) return res.json(cart);
    else return res.status(401).send({ message: "User or Product not found" });
  });
});

// HTTP POST /api/orders
// Add a new order using the data in the shopping cart
app.post("/api/orders", function (req, res, next) {
  var uid = req.cookies.userid;
  return Model.purchase(
    uid,
    req.body.date,
    req.body.address,
    req.body.cardNumber,
    req.body.cardHolder
  ).then(function (order) {
    if (order) {
      return res.json(order);
    } else return res.status(401).send({ message: "User not found" });
  });
});

// HTTP GET /api/products
// Obtains all products
app.get("/api/products", function (req, res, next) {
  return model.getProducts().then(function (products) {
    if (products) return res.json(products);
    else return res.status(500).send({ message: "Cannot retrieve products" });
  });
});

// HTTP GET /api/cart/qty
// Obtains the user's shopping cart quantity
app.get('/api/cart/qty', passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    console.log(req.user)
    var userid = useridFromToken(req, res);
    if (!userid) return res.status(401).send({ message: 'User has not signed in' });
    else
      return model.getUserCartQty(userid)
        .then(function (userCartQty) {
          if (userCartQty) return res.json(userCartQty);
          else return res.status(500).send({ message: 'Cannot retrieve user cart quantity' });
        })
        .catch(function (error) {
          return res.status(500).send({ message: 'Cannot retrieve user cart quantity' })
        })
  });

// HTTP GET /api/cart
// Obtains the user's shopping cart
app.get("/api/cart", function (req, res, next) {
  var uid = req.cookies.userid;
  return Model.getCartByUserId(uid).then(function (cart) {
    if (cart) {
      return res.json(cart);
    } else return res.status(401).send({ message: "User shopping cart not found" });
  });
});

// HTTP GET /api/users/profile
// Obtains the user's profile by id
app.get("/api/users/profile", function (req, res, next) {
  var uid = req.cookies.userid;
  return Model.getProfileByUserId(uid).then(function (profile) {
    if (profile) {
      return res.json(profile);
    } else return res.status(401).send({ message: "User not found" });
  });
});

// HTTP GET /api/users/profile
// Obtains the user's orders
app.get("/api/orders", function (req, res, next) {
  var uid = req.cookies.userid;
  return Model.getOrdersByUserId(uid).then(function (orders) {
    if (orders) {
      return res.json(orders);
    } else return res.status(401).send({ message: "Orders not found" });
  });
});

// HTTP GET /api/orders/id/:id
// Obtain the order with :id
app.get("/api/orders/id/:id", function (req, res, next) {
  var oid = req.params.id;
  var uid = req.cookies.userid;
  return Model.getOrder(uid, oid).then(function (order) {
    console.log(order);
    if (order) {
      return res.json(order);
    } else return res.status(401).send({ message: "User or Order not found" });
  });
});

// HTTP DELETE /api/cart/items/product/:id/one
// Removes one item of a product type from the user's shopping cart
app.delete("/api/cart/items/product/:id/one", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  return Model.removeOne(uid, pid).then(function (cart) {
    if (cart) {
      return res.json(cart);
    } else return res.status(401).send({ message: "User or Product not found" });
  });
});

// HTTP DELETE /api/cart/items/product/:id/all
// Removes a product type from the user's shopping cart
app.delete("/api/cart/items/product/:id/all", function (req, res, next) {
  var pid = req.params.id;
  var uid = req.cookies.userid;
  return Model.removeAll(uid, pid).then(function (cart) {
    if (cart) {
      return res.json(cart);
    } else return res.status(401).send({ message: "User or Product not found" });
  });
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
