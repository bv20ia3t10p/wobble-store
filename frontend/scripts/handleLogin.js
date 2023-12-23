const currentWindow = new URL(
  window.location.href.replace("html#state=", "html?state=")
);
var YOUR_CLIENT_ID =
  "433141860892-7qmra9ujnn35sslqurun4upjapcl2q2p.apps.googleusercontent.com";
var YOUR_REDIRECT_URI = currentWindow.origin + currentWindow.pathname;
var oath_url = url + "/api/Auth";

document.addEventListener("DOMContentLoaded", async function () {
  document
    .querySelector("#register-form")
    .addEventListener("submit", handleRegister);
  document
    .querySelector("#login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleLogin(e);
    });
  document
    .querySelector("#signinWithGoogle")
    .addEventListener("click", async (e) => {
      loginWithGoogle();
    });
  document.querySelectorAll(".activatePage").forEach((e) =>
    e.addEventListener("click", () => {
      const loginPage = document.querySelector(".loginOrRegister .login");
      const registerPage = document.querySelector(".loginOrRegister .register");
      loginPage.setAttribute(
        "class",
        loginPage.getAttribute("class") === "login activePage"
          ? "login inactivePage"
          : "login activePage"
      );
      registerPage.setAttribute(
        "class",
        registerPage.getAttribute("class") === "register activePage"
          ? "register inactivePage"
          : "register activePage"
      );
      switch (localStorage.getItem("loginState")) {
        case "register":
          localStorage.setItem("loginState", "login");
          break;
        case "login":
          localStorage.setItem("loginState", "register");
          break;
        default:
          localStorage.setItem("loginState", "login");
      }
    })
  );

  switch (localStorage.getItem("loginState")) {
    case "register":
      document.querySelector(".activatePage").click();
      localStorage.setItem("loginState", "register");
      break;
    case "login":
      try {
        const tokenFromUrl = currentWindow.searchParams.get("access_token");
        if (!tokenFromUrl) throw new Error("No token from Url");
        loginWithGoogle(tokenFromUrl);
      } catch {}
      break;
    default:
      localStorage.setItem("loginState", "login");
  }
});

const loginWithGoogle = async (tokenFromUrl = null) => {
  if (!tokenFromUrl) {
    oauth2SignIn();
  }
  showLoadingPopup(
    true,
    document.querySelector("main"),
    "Logging in with google..."
  );
  localStorage.setItem("googleToken", tokenFromUrl);
  await fetch(oath_url + "?googletoken=" + tokenFromUrl, {
    method: "POST",
    body: JSON.stringify({ customerEmail: "", customerPassword: "" }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((e) => {
      if (e.ok) return e.json();
    })
    .then((data) => {
      localStorage.setItem("accountToken", data.token);
      localStorage.removeItem("loginState");
      localStorage.removeItem("googleToken");
      navigateToNewPage("/index.html");
    })
    .catch((error) => console.log(error));
};

const handleLogin = async (e) => {
  showLoadingPopup(true, document.querySelector("main"), "Logging in...");
  inputData = new FormData(e.target);
  const customer = {
    customerEmail: inputData.get("customerEmail")
      ? inputData.get("customerEmail")
      : "",
    customerPassword: inputData.get("customerPassword")
      ? inputData.get("customerPassword")
      : "",
  };
  const resp = await fetch(oath_url + '?googletoken=" "', {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(customer),
  }).catch((e) => alert(e));
  const data = await resp.json();
  localStorage.setItem("accountToken", data.token);
  navigateToNewPage("/index.html");
};

function oauth2SignIn() {
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);
  var params = {
    client_id: YOUR_CLIENT_ID,
    redirect_uri: YOUR_REDIRECT_URI,
    scope: `profile email`,
    state: "pass-through value",
    include_granted_scopes: "true",
    response_type: "token",
  };

  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

register_url = url + "/api/Customer";

const handleRegister = async (e) => {
  e.preventDefault();
  showLoadingPopup(
    true,
    document.querySelector("main"),
    "Processing your request"
  );
  const inputData = new FormData(e.target);
  const newUser = {
    customerCity: inputData.get("customerCity"),
    customerCountry: inputData.get("customerCountry"),
    customerSegment: inputData.get("customerSegment"),
    customerStreet: inputData.get("customerStreet"),
    customerState: inputData.get("customerState"),
    customerZipcode: inputData.get("customerZipcode"),
    customerEmail: inputData.get("customerEmail"),
    customerPassword: inputData.get("customerPassword"),
    customerFname: inputData.get("customerFname"),
    customerLname: inputData.get("customerLname"),
    customerId: 123,
  };
  console.log(newUser);
  await fetch(register_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(newUser),
  })
    .then(async (e) => {
      if (e.status === 400)
        return e.text().then((text) => {
          throw new Error(text);
        });
      return e.json();
    })
    .then(async (data) => {
      console.log(data);
      showLoadingPopup(
        true,
        document.querySelector("main"),
        "Logging you in..."
      );
      await fetch(oath_url + '?googletoken=" "', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          customerPassword: data.customerPassword,
          customerEmail: data.customerEmail,
        }),
      })
        .then((e) => {
          if (e.ok) return e.json();
        })
        .then((e) => {
          localStorage.setItem("accountToken", e.token);
          navigateToNewPage("/index.html");
        })
        .catch((e) => alert(e));
    })
    .catch((e) => {
      alert(e);
      showLoadingPopup(false, document.querySelector("main"));
    });
};
