var User = require("./user");
var Cart = require("./shopping-cart");
var Product = require("./product");
var Order = require("./order");
const shoppingCart = require("./shopping-cart");
Model = {};

Model.user = null;

Model.users = [
  {
    _id: 100,
    email: "cristian@gmail.com",
    password: "adminn",
    name: "Cristian",
    surname: "Stanimirov",
    birth: "1999-07-23",
    address: "Albacete",
    shoppingCart: { items: [], qty: 0, total: 0, subtotal: 0, tax: 0 },
    orders: [],
  },
];

// Functions
// If user exists, it is signed in
Model.signin = function (email, password) {
  return User.findOne({ email, password });
};

// This function signs out from the server side
Model.signout = function () {
  Model.user = null;
};

// This function tries to sign up a new user
Model.signup = function (name, surname, address, birth, email, password) {
  return User.findOne({ email }).then(function (user) {
    if (!user) {
      var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
      var user = new User({
        email,
        password,
        name,
        surname,
        birth,
        address,
        shoppingCart: cart,
      });
      return cart.save().then(function () {
        return user.save();
      });
    } else return null;
  });
};

Model.getProducts = function () {
  return Product.find();
};

// Return the product with id: pid
Model.getProductById = function (pid) {
  return Product.findById(pid);
};

// // Obtain the user object
// Model.getUserById = function (userid) {
//   for (var i = 0; i < Model.users.length; i++) {
//     if (Model.users[i]._id == userid) return Model.users[i];
//   }
//   return null;
// };

Model.getUserByIdWithCart = function (userid) {
  return User.findById(userid).populate("shoppingCart");
};

// Return the user's cart qty
Model.getUserCartQty = function (userid) {
  return User.findById(userid).populate({
    path: "shoppingCart",
    select: "qty",
  });
};

// Add product to the user's cart
Model.buy = function (uid, pid) {
  return Promise.all([
    Model.getProductById(pid),
    Model.getUserByIdWithCart(uid),
  ])
    .then(function (results) {
      var product = results[0];
      var user = results[1];
      if (user && product) {
        var item = null;
        for (var i = 0; i < user.shoppingCart.items.length; i++) {
          if (user.shoppingCart.items[i].product == pid) {
            item = user.shoppingCart.items[i];
            user.shoppingCart.items.remove(item);
          }
        }
        if (!item) {
          item = { qty: 0 };
        }
        item.qty++;
        item.product = product._id;
        item.title = product.title;
        item.price = product.price;
        item.total = item.qty * item.price;
        user.shoppingCart.items.push(item);
        Model.updateShoppingCart(user);
        return user.shoppingCart.save().then(function (result) {
          return result;
        });
      } else return null;
    })
    .catch(function (errors) {
      console.error(errors);
      return null;
    });
};

// Update the shopping cart info
Model.updateShoppingCart = function (user) {
  user.shoppingCart.qty = 0;
  user.shoppingCart.total = 0;
  for (var i = 0; i < user.shoppingCart.items.length; i++) {
    user.shoppingCart.qty =
      user.shoppingCart.qty + user.shoppingCart.items[i].qty;
    user.shoppingCart.total =
      user.shoppingCart.total + user.shoppingCart.items[i].total;
  }
  user.shoppingCart.subtotal = user.shoppingCart.total / 1.21;
  user.shoppingCart.tax = user.shoppingCart.subtotal * 0.21;
};

// Return the user's shopping cart
Model.getCartByUserId = function (uid) {
  return Model.getUserByIdWithCart(uid).then(function (user) {
    return user.shoppingCart;
  });
};

// Remove one product from the user's shopping cart
Model.removeOne = function (uid, pid) {
  return Promise.all([
    Model.getProductById(pid),
    Model.getUserByIdWithCart(uid),
  ]).then(function (results) {
    var product = results[0];
    console.log("funcion llamada");
    var user = results[1];
    if (user && product) {
      for (var i = 0; i < user.shoppingCart.items.length; i++) {
        if (user.shoppingCart.items[i].product == pid) {
          console.log(
            "Comparamos",
            user.shoppingCart.items[i].product,
            "Con",
            pid
          );
          var item = user.shoppingCart.items[i];
          user.shoppingCart.items.remove(item);
          item.qty = item.qty - 1;
          if (item.qty > 0) {
            item.price = product.price;
            item.total = item.qty * item.price;
            user.shoppingCart.items.push(item);
          }
          Model.updateShoppingCart(user);
          return user.shoppingCart.save().then(function (result) {
            return result;
          });
        }
      }
    } else return null;
  });
};

// Remove all the products of the same type from the user's shopping cart
Model.removeAll = function (uid, pid) {
  return Promise.all([
    Model.getProductById(pid),
    Model.getUserByIdWithCart(uid),
  ]).then(function (results) {
    var product = results[0];
    console.log("funcion llamada");
    var user = results[1];
    if (user && product) {
      for (var i = 0; i < user.shoppingCart.items.length; i++) {
        if (user.shoppingCart.items[i].product == pid) {
          console.log(
            "Comparamos",
            user.shoppingCart.items[i].product,
            "Con",
            pid
          );
          var item = user.shoppingCart.items[i];
          user.shoppingCart.items.remove(item);
          Model.updateShoppingCart(user);
          return user.shoppingCart.save().then(function (result) {
            return result;
          });
        }
      }
    } else return null;
  });
};

// Return the user's profile
Model.getProfileByUserId = function (uid) {
  u = Model.getUserById(uid);
  profile = {
    name: u.name,
    surname: u.surname,
    birth: u.birth,
    address: u.address,
    email: u.email,
    shoppingCart: {
      qty: u.shoppingCart.qty,
    },
  };
  return profile;
};

// Return the user's orders
Model.getOrdersByUserId = function (uid) {
  return Order.find({user: uid})
};

// Create a new order with the products on the shopping cart
Model.purchase = function (userid, date, address, cardNumber, cardHolder) {
  return Model.getUserByIdWithCart(userid).then(function (user) {
    if (user) {
      var id_order = new Date().getTime();
      var order = new Order({
        number: id_order,
        date: date,
        address: address,
        cardNumber: cardNumber,
        cardHolder: cardHolder,
        subtotal: user.shoppingCart.subtotal,
        tax: user.shoppingCart.tax,
        total: user.shoppingCart.total,
        items: [],
        user: userid,
      });
      for (var item of user.shoppingCart.items) {
        order.items.push(item);
      }
      user.shoppingCart.items = [];
      user.shoppingCart.qty = 0;
      user.shoppingCart.total = 0;
      user.shoppingCart.subtotal = 0;
      user.shoppingCart.tax = 0;
      return order.save()
      .then(function() {
        return user.shoppingCart.save()
      }).then(function(){
        return order.number;
      })
    } else return null;
  }) 
};

// Returns the user's number order
Model.getOrder = function (userid, number) {
  return Order.findOne({number:number, user:userid})
};

module.exports = Model;
