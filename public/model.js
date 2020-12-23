Model = {};

// Perform a GET request to obtain products
Model.getProducts = function () {
  return $.ajax({ url: "/api/products", method: "GET" });
};

// Perform a POST with email and password to try to sign in
Model.signin = function (email, password) {
  return $.ajax({
    url: "/api/users/signin",
    method: "POST",
    data: { email, password },
  });
};

// obtains the user from cookie
Model.getToken = function () {
  var decoded = decodeURIComponent(document.cookie);
  return decoded.substring(6, decoded.length);
};

// Signout and delete from the cookie
// We do not sign out from the server, only in the client side
Model.signout = function () {
  document.cookie = "token=;expires=0;path=/;";
};
// Perform a POST with the product id to add it to the user's shopping cart
Model.buy = function (pid) {
  return $.ajax({ url: "/api/cart/items/product/" + pid, method: "POST" });
};

// Perform a GET request to obtain the user's shopping cart qty
Model.getUserCartQty = function () {
  return $.ajax({
    url: "/api/cart/qty",
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + Model.getToken());
    },
  });
};

// Perform a GET request to obtain the user's shopping cart
Model.getCart = function () {
  return $.ajax({ url: "/api/cart", method: "GET" });
};

// Perform a GET request to obtain the user's profile
Model.getProfile = function () {
  return $.ajax({ url: "/api/users/profile", method: "GET" });
};

// Perform a GET request to obtain the user's orders
Model.getOrders = function () {
  return $.ajax({ url: "/api/orders", method: "GET" });
};

// Perform a GET with the order id to obtain the order
Model.getOrder = function (oid) {
  return $.ajax({ url: "/api/orders/id/" + oid, method: "GET" });
};

// Perform a DELETE request to remove one item of a product type
Model.removeOne = function (pid) {
  return $.ajax({
    url: "/api/cart/items/product/" + pid + "/one",
    method: "DELETE",
  });
};

// Perform a DELETE request to remove a product type
Model.removeAll = function (pid) {
  return $.ajax({
    url: "/api/cart/items/product/" + pid + "/all",
    method: "DELETE",
  });
};

// Perform a POST with email and password to try to sign in
Model.signup = function (email, password, name, surname, birth, address) {
  return $.ajax({
    url: "/api/users/signup",
    method: "POST",
    data: { email, password, name, surname, birth, address },
  });
};

// Perform a POST with email and password to try to sign in
Model.purchase = function (date, address, cardNumber, cardHolder) {
  return $.ajax({
    url: "/api/orders",
    method: "POST",
    data: { date, address, cardNumber, cardHolder },
  });
};

Model.lastSignup = null;
