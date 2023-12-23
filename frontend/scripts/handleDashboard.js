var loadedUser = {};
const accountToken = localStorage.getItem("accountToken");
let cart = JSON.parse(localStorage.getItem("cart"));
let isEditingPassword = 0;

window.addEventListener("DOMContentLoaded", async () => {
  showOrHidePasswordInputFields(0);
  await getCategories();
  if (!accountToken || accountToken.length < 10) {
    alert("Not logged in, redirecting you to login page");
    navigateToNewPage("/loginOrRegister.html");
  }
  updateBadge(cart ? cart.length : 0);
  document
    .querySelector(".changePassword button")
    .addEventListener("click", () => {
      isEditingPassword = 1;
      showOrHidePasswordInputFields(isEditingPassword);
    });
  document
    .querySelector('form button[type="reset"]')
    .addEventListener("click", () => {
      isEditingPassword = 0;
      showOrHidePasswordInputFields(isEditingPassword);
    });
  await loadCustomerInfo();
  console.log("dom", loadedUser);
  document.querySelector("main form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleUpdate(e);
  });
  setLoadingPageVisibility(false);
});

const loadCustomerInfo = async () => {
  const customerInfoUrl = url + "/api/Customer/Email";
  await fetch(customerInfoUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then((e) => {
      if (e.ok) return e.json();
    })
    .then((e) => {
      loadedUser = e;
      updateUserFields(e);
    })
    .catch((e) => {
      alert("Token expired, redirecting you to login page");
      navigateToNewPage("/loginOrRegister.html");
    });
};

const updateUserFields = (user) => {
  document
    .querySelector("#customerFname")
    .setAttribute("placeholder", user.customerFname);
  document
    .querySelector("#customerState")
    .setAttribute("placeholder", user.customerState);
  document
    .querySelector("#customerCountry")
    .setAttribute("placeholder", user.customerCountry);
  document
    .querySelector("#customerZipcode")
    .setAttribute("placeholder", user.customerZipcode);
  document
    .querySelector("#customerLname")
    .setAttribute("placeholder", user.customerLname);
  document
    .querySelector("#customerCity")
    .setAttribute("placeholder", user.customerCity);
  document
    .querySelector("#customerStreet")
    .setAttribute("placeholder", user.customerStreet);
  removeAndReplaceNodeText(
    document.querySelector("#customerEmail"),
    user.customerEmail
  );
  document
    .querySelector("#customerLname")
    .setAttribute("placeholder", user.customerLname);
};

const showOrHidePasswordInputFields = (visibility) => {
  document
    .querySelector(".changePassword")
    .setAttribute(
      "class",
      visibility ? "changePassword hidden" : "changePassword"
    );
  document
    .querySelector(".newPassword")
    .setAttribute("class", visibility ? "newPassword" : "newPassword hidden");
  document
    .querySelector(".rePassword")
    .setAttribute("class", visibility ? "rePassword" : "rePassword hidden");
};

const handleUpdate = async (e) => {
  if (isEditingPassword) {
    const pw = document.querySelector("#customerPassword").value;
    const rpw = document.querySelector("#rePassword").value;
    if (pw !== rpw) {
      alert("Re-entered password do not match");
      return;
    } else loadedUser = { ...loadedUser, customerPassword: pw };
  }
  showLoadingPopup(
    true,
    document.querySelector("main"),
    "Processing your request"
  );
  const updateUrl = url + "/api/Customer/Update";
  formInput = new FormData(e.target);
  payload = {
    ...loadedUser,
    customerFname: formInput.get("customerFname")
      ? formInput.get("customerFname")
      : loadedUser.customerFname,
    customerLname: formInput.get("customerLname")
      ? formInput.get("customerLname")
      : loadedUser.customerLname,
    customerState: formInput.get("customerState")
      ? formInput.get("customerState")
      : loadedUser.customerState,
    customerCountry: formInput.get("customerCountry")
      ? formInput.get("customerCountry")
      : loadedUser.customerCountry,
    customerZipcode: formInput.get("customerZipcode")
      ? formInput.get("customerZipcode")
      : loadedUser.customerZipcode,
    customerStreet: formInput.get("customerStreet")
      ? formInput.get("customerStreet")
      : loadedUser.customerStreet,
    customerCity: formInput.get("customerCity")
      ? formInput.get("customerCity")
      : loadedUser.customerCity,
    customerSegment: !loadedUser.customerSegment
      ? "Consumer"
      : loadedUser.customerSegment,
  };
  await fetch(updateUrl, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accountToken,
    },
  })
    .then(async (e) => {
      if (e.ok) {
        return e.json();
      } else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .then(async (e) => {
      loadedUser = e;
      console.log(e);
      await loadCustomerInfo(e);
      updateUserFields(loadedUser);
      document.querySelector('main form button[type="reset"]').click();
      showLoadingPopup(false, document.querySelector("main"));
    })
    .catch((e) => {
      alert(e);
      showLoadingPopup(false, document.querySelector("main"));
    });
};
