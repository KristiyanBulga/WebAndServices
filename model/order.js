var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Collection
var schema = Schema({
  number: { type:String, required: true},
  date: { type: Date, required: true },
  address: { type: String, required: true },
  cardNumber: { type: Number, required: true },
  cardHolder: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  items: {
    type: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Order", schema);
