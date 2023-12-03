const url = "https://ecommercebackend20231127233624.azurewebsites.net";
const flask_url = "https://itemrecforwobblestore.azurewebsites.net";

const showLoadingPopup = (visibility, main, title = "") => {
  const navbar = document.querySelector("navbar");
  const currentClass = main.getAttribute("class");
  const loaderElement = document.querySelector(".universalLoader");
  switch (visibility) {
    case true:
      main.setAttribute("class", currentClass + " dimmed");
      const titleElement = document.querySelector(".universalLoader .title");
      removeAndReplaceNodeText(titleElement, title);
      loaderElement.setAttribute("class", "universalLoader");
      if (navbar) navbar.setAttribute("class", "navbar dimmed");
      break;
    default:
      main.setAttribute("class", currentClass.replace(" dimmed", ""));
      loaderElement.setAttribute("class", "universalLoader finished");
      if (navbar) navbar.setAttribute("class", "navbar");
  }
};

const addToCart = (id, quantity) => {
  try {
    id = Number(id);
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log(cart);
    let exist = 0;
    cart.forEach((item) => {
      if (item.id === id) {
        exist = 1;
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });
    if (!exist) {
      let newCart = [...cart, { id, quantity, checked: false }];
      localStorage.setItem("cart", JSON.stringify(newCart));
      updateBadge(newCart.length);
    }
  } catch (e) {
    localStorage.setItem("cart", JSON.stringify([{ id, quantity }]));
    updateBadge(1);
  }
};

const openItemDetails = (id) => {
  const tempForm = document.createElement("form");
  tempForm.setAttribute("method", "GET");
  tempForm.setAttribute("action", "item.html");
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
const updateBadge = (badgeNumber) => {
  const badgeClass = document.querySelector(".navbar .action.cart .badge");
  try {
    badgeClass.removeChild(badgeClass.lastChild);
  } catch (e) {
    console.log(e);
  }
  badgeClass.appendChild(document.createTextNode(badgeNumber));
};

const removeAndReplaceNodeText = (node, text) => {
  node.removeChild(node.childNodes[0]);
  node.appendChild(document.createTextNode(text));
};

const setLoadingPageVisibility = (visibility) => {
  document
    .querySelector(".loadingScreen")
    .setAttribute(
      "class",
      visibility ? "loadingScreen" : "loadingScreen finished"
    );
};

const clearAllContent = (e) => {
  while (e.lastElementChild) {
    e.removeChild(e.lastElementChild);
  }
};

const checkLoggedIn = () => {
  const loginAction = document.querySelector(".navbar .action.account");
  try {
    if (localStorage.getItem("accountToken").length > 0) {
      removeAndReplaceNodeText(loginAction.querySelector("button"), "Logout");
      loginAction.addEventListener("submit", (e) => {
        e.preventDefault();
        localStorage.clear();
        const tempForm = document.createElement("form");
        tempForm.setAttribute("method", "GET");
        tempForm.setAttribute("action", "/");
        document.body.appendChild(tempForm);
        tempForm.submit();
      });
    } else throw new Error("Not logged in");
  } catch (e) {
    removeAndReplaceNodeText(loginAction.querySelector("button"), "Login");
    loginAction.addEventListener("submit", () => {});
  }
};

const navigateToNewPage = (url, params = null) => {
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", url);
  document.body.appendChild(form);
  form.submit();
};

const createNewSearch = (param, value, additionalOpt = null, sort = null) => {
  var form = document.createElement("form");
  var input = document.createElement("input");
  var params = {
    [param]: value,
  };
  if (sort) params = { ...params, sort };
  if (additionalOpt) params = { ...params, additionalOpt };
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", "search.html");
  document.body.appendChild(form);
  form.submit();
};
