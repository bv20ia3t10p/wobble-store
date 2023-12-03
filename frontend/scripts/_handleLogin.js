oath_url = url + "/api/Auth";

var YOUR_CLIENT_ID =
  "433141860892-7qmra9ujnn35sslqurun4upjapcl2q2p.apps.googleusercontent.com";
var currentUrl = new URL(window.location.href);
var YOUR_REDIRECT_URI = currentUrl.origin + currentUrl.pathname;

document.addEventListener("DOMContentLoaded", async function () {
  document
    .querySelector("#register-form")
    .addEventListener("submit", handleRegister);
  document
    .querySelector("#registerWithGoogle")
    .addEventListener("click", () => {
      trySampleRequest();
      localStorage.setItem("loginState", "register");
    });
  document.querySelector("#login-form").addEventListener("submit", handleLogin);
  document
    .querySelector("#signinWithGoogle")
    .addEventListener("click", async () => {
      await trySampleRequest();
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
  const currentWindow = new URL(
    window.location.href.replace("#state=", "?state=")
  );
  switch (localStorage.getItem("loginState")) {
    case "register":
      try {
        const tokenFromUrl = currentWindow.searchParams.get("access_token");
        if (!tokenFromUrl) throw new Error("No token");
        localStorage.setItem("googleToken", tokenFromUrl);
        trySampleRequest();
      } catch {}
      document.querySelector(".activatePage").click();
      localStorage.setItem("loginState", "register");
      break;
    case "login":
      try {
        const tokenFromUrl = currentWindow.searchParams.get("access_token");
        if (!tokenFromUrl && !localStorage.getItem("googleToken"))
          throw new Error("No token");
        localStorage.setItem("googleToken", tokenFromUrl);
        const requestUrl =
          "https://www.googleapis.com/oauth2/v3/userinfo?" +
          "access_token=" +
          ggToken;
        console.log(requestUrl);
        await fetch(requestUrl)
          .then((e) => {
            if (e.ok) return e.json();
            throw new Error("Failed");
          })
          .then(() => {
            fetch(
              "https://ecommercebackend20231127233624.azurewebsites.net/api/Auth?googletoken" +
                ggToken,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  "Access-Control-Allow-Origins": "*",
                },
                body: JSON.stringify({
                  customerPassword: "",
                  customerEmail: "",
                }),
              }
            )
              .then((e) => {
                if (e.ok) return e.json();
              })
              .then((e2) => {
                localStorage.setItem("accountToken", e2);
                navigateToNewPage("/index.html");
              })
              .catch((e) => alert(e));
          })
          .catch(() => {
            localStorage.clear();
            oauth2SignIn();
          });
        await document.querySelector("#login-form").submit();
        localStorage.removeItem("loginState");
      } catch {}
      break;
    default:
      localStorage.setItem("loginState", "login");
  }
});

const handleLogin = async (e) => {
  e.preventDefault();
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
  console.log(customer);
  let ggToken = "0";
  try {
    ggToken = localStorage.getItem("googleToken");
  } catch {
    console.log("No google auth");
  }
  // Testing
  const resp = await fetch(
    "https://ecommercebackend20231127233624.azurewebsites.net/api/Auth" +
      +ggToken.length >
      10
      ? "?googletoken=" + ggToken
      : "",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origins": "*",
      },
      body: JSON.stringify(customer),
    }
  ).catch((e) => alert(e));
  const data = await resp.json();
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", "index.html");
  document.body.appendChild(form);
  form.submit();
  localStorage.setItem("accountToken", data.token);
};

const trySampleRequest = async () => {
  var ggToken = "";
  try {
    ggToken =
      localStorage.getItem("googleToken") === "null"
        ? "0"
        : localStorage.getItem("googleToken");
    if (ggToken === "0" || ggToken === "null" || ggToken === null)
      throw new Error("No token");
    const requestUrl =
      "https://www.googleapis.com/oauth2/v3/userinfo?" +
      "access_token=" +
      ggToken;
    console.log(requestUrl);
    await fetch(requestUrl)
      .then((e) => {
        if (e.ok) return e.json();
        throw new Error("Failed");
      })
      .then((serverResponse) => {
        console.log(serverResponse);
        if (typeof serverResponse.email)
          document.querySelector("#login-email").value = serverResponse.email;
        document.querySelector("#login-password").value = serverResponse.email;
        if (typeof serverResponse.given_name)
          document.querySelector("#register-fname").value =
            serverResponse.given_name;
        if (typeof serverResponse.family_name)
          document.querySelector("#register-lname").value =
            serverResponse.family_name;
        if (typeof serverResponse.email)
          document.querySelector("#register-email").value =
            serverResponse.email;
      })
      .catch(() => {
        localStorage.clear();
        oauth2SignIn();
      });
  } catch (e) {
    oauth2SignIn();
  }
};

function oauth2SignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Create element to open OAuth 2.0 endpoint in new window.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id: YOUR_CLIENT_ID,
    redirect_uri: YOUR_REDIRECT_URI,
    scope: `profile email`,
    state: "pass-through value",
    include_granted_scopes: "true",
    response_type: "token",
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

register_url = url + "/api/Customer";

const handleRegister = async (e) => {
  e.preventDefault();
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
  const resp = await fetch(register_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(newUser),
  });
  const data = await resp.json();
  console.log(data);
};
