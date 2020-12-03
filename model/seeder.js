var mongoose = require('mongoose');
var User = require('./user');
var Cart = require('./shopping-cart');

var uri = 'mongodb://localhost/bookshop';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to ', uri); });
db.on('connected', function () { console.log('Connected to ', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from ', uri); });
db.on('disconnected', function () { console.log('Disconnected from ', uri); });
db.on('error', function (err) { console.error('Error ', err.message); });

var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
var user = new User({ email: 'tesorieror@gmail.com', password: 'admin', name: 'Ricardo', surname: 'Tesoriero', birth: '1977-07-01', address: 'ESII, UCLM', shoppingCart: cart });

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () { return Cart.deleteMany() })
  .then(function () { return User.deleteMany() })
  .then(function () { return cart.save() })
  .then(function () { return user.save() })
  .then(function () { return mongoose.disconnect(); })
  .catch(function (err) { console.error('Error ', err.message); })

// var mongoose = require("mongoose");
// var User = require("./user");
// var Cart = require("./shopping-cart");

// var uri = "mongodb://localhost/bookshop";
// mongoose.Promise = global.Promise;

// // Some handlers to help us
// var db = mongoose.connection;
// db.on("connecting", function () {
//   console.log("Connecting to ", uri);
// });
// db.on("connected", function () {
//   console.log("Connected to ", uri);
// });
// db.on("disconnecting", function () {
//   console.log("Disconnecting from ", uri);
// });
// db.on("disconnected", function () {
//   console.log("Disconnected from ", uri);
// });
// db.on("error", function (err) {
//   console.error("Error ", err.message);
// });

// var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
// var user = new User({
//   email: "tesorieror@gmail.com",
//   password: "admin",
//   name: "Ricardo",
//   surname: "Tesoriero",
//   birth: "1977-07-01",
//   address: "ESII, UCLM",
//   shoppingCart: cart,
// });
// user.shoppingCart.items.push({
//   title: "Title",
//   qty: 1,
//   total: 100,
//   price: 100,
// });
// cart.qty = 1;
// cart.total = 121;
// cart.subtotal = 100;
// cart.tax = 21;

// // Make connection to the database
// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(function () { return Cart.deleteMany() })
//   .then(function () { return User.deleteMany() })
//   .then(function () { return cart.save() })
//   .then(function () { return user.save() })
//   .then(function () { console.log('User ', user) })
//   .then(function () { return User.find({ email: 'tesorieror@gmail.com' }) })
//   .then(function (result) { console.log('User ', result) })
//   .then(function () { return User.find({ email: 'tesorieror@gmail.com' }).populate('shoppingCart') })
//   .then(function (result) { console.log('User populate ', result); console.log('User cart ', result[0].shoppingCart); })
//   .then(function () { return mongoose.disconnect(); })
//   .catch(function (err) { console.error('Error ', err.message); })

// //   // .then(function () {
// //   //   var user = new User({
// //   //     email: 'tesorieror@gmail.com',
// //   //     password: 'admin',
// //   //     name: 'Ricardo',
// //   //     surname: 'Tesoriero',
// //   //     birth: '1977-07-01',
// //   //     address: 'ESII, UCLM',
// //   //   });
// //   //   return user.save()
// //   //   })
// //   .then(function () {
// //     return User.findOne({ email: "tesorieror@gmail.com" });
// //     //   return User.findById(mongoose.Types.ObjectId('5fb2a669931d0d4a6c0604b0'))
// //     //   return User.User.deleteOne({email:'tesorieror@gmail.com'})
// //     //   return User.findOne({email:'tesorieror@gmail.com'})
// //   })
// //   //   .then(function(result){
// //   //       return result.remove()
// //   //   })
// //   // Modify the data
// //   .then(function (user) {
// //     user.password = "admin2";
// //     return user.save();
// //   })
// //   .then(function (result) {
// //     console.log(result);
// //     return mongoose.disconnect();
// //   })
// //   .catch(function (err) {
// //     console.error("Error", err.message);
// //   });
