Model = {};

// Perform a GET request to obtain products
Model.getProducts = function () {
  return $.ajax({ url: "/api/products", method: "GET" });
};

// Perform a POST with email and password
Model.signin = function (email, password) {
  return $.ajax({
    url: "/api/users/signin",
    method: "POST",
    data: { email, password },
  });
};

// Obtain the user from cookie
Model.getUserId = function () {
  var decoded = decodeURIComponent(document.cookie);
  return decoded.substring(7, decoded.length);
};

// Signout and delete from the cookie
// We do not sign out from the server only in the client side
Model.signout = function () {
  //Model.user = null;
  document.cookie = "userid=;expires=0;path=/;";
};

// Obtain the cart qty
Model.getUserCartQty = function () {
  return $.ajax({ url: "/api/cart/qty", method: "GET" });
};

Model.buy = function (pid) {
  return $.ajax({ url: "/api/cart/items/product/" + pid, method: "POST" });
};

Model.getCart = function () {
  return $.ajax({ url: "/api/cart", method: "GET" });
};

Model.removeOne = function (pid) {
    return $.ajax({ url: '/api/cart/items/product/' + pid+'/one', method: 'DELETE' })
  }
  