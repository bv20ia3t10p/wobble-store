export const url = "https://localhost:7136";
export const flask_url = "http://localhost:5000";

export const openItemDetails = (id) => {
  const tempForm = document.createElement("form");
  tempForm.setAttribute("method", "GET");
  tempForm.setAttribute("action", "item");
  var params = {
    productId: id,
  };
  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    tempForm.appendChild(input);
  }
  document.body.appendChild(tempForm);
  tempForm.submit();
};

export const addToCart = (id, quantity) => {
  try {
    id = Number(id);
    let cart = JSON.parse(localStorage.getItem("cart"));
    let exist = 0;
    cart.forEach((item) => {
      if (item.id === id) {
        exist = 1;
        item.quantity += quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });
    if (!exist) {
      let newCart = [...cart, { id, quantity, checked: false }];
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    localStorage.setItem(
      "cart",
      JSON.stringify([{ id, quantity, checked: false }])
    );
  }
};

export const createNewSearch = (
  param,
  value,
  additionalOpt = null,
  sort = null
) => {
  var form = document.createElement("form");
  var input = document.createElement("input");
  var params = {
    [param]: value,
  };
  if (sort) params = { ...params, sort };
  if (additionalOpt) params = { ...params, additionalOpt };
  for (var p in params) {
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", "/search");
  document.body.appendChild(form);
  form.submit();
};

export const navigateToNewPage = (url, params = null) => {
  var form = document.createElement("form");
  if (params)
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", url);
  document.body.appendChild(form);
  form.submit();
};
