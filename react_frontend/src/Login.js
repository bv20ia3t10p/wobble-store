import React, { useCallback, useEffect, useState } from "react";
import "./stylesheets/loginOrRegister.css";
import "./stylesheets/loginAnimation.css";
import { url, navigateToNewPage } from "./utils";
import { useLoadingContext } from "./LoadingContext";

const Login = () => {
  const { isLoading, setDialogueLoading, pageLoader, setPageLoaded } =
    useLoadingContext();
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    city: "",
    country: "Algeria",
    street: "",
    segment: "Consumer",
    state: "",
    zip: 0,
  });
  const register_url = url + "/api/Customer";
  const oauth2SignIn = useCallback(() => {
    const currentWindow = new URL(
      window.location.href.replace("html#state=", "html?state=")
    );
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);
    var params = {
      client_id:
        "433141860892-7qmra9ujnn35sslqurun4upjapcl2q2p.apps.googleusercontent.com",
      redirect_uri: currentWindow.origin + currentWindow.pathname,
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
  }, []);
  const loginWithGoogle = useCallback(async () => {
    oauth2SignIn();
  }, [oauth2SignIn]);
  useEffect(() => {
    setPageLoaded(true);
    const currentWindow = new URL(
      window.location.href.replace("login#state=", "login?state=")
    );
    try {
      const googleToken = currentWindow.searchParams.get("access_token");
      if (!googleToken || googleToken.length < 10)
        throw new Error("No token retrieved, useEffect");
      const loginWithGoogleToken = async () => {
        await fetch(url + "/api/Auth?googletoken=" + googleToken, {
          method: "POST",
          body: JSON.stringify({ customerEmail: "", customerPassword: "" }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((e) => {
            if (e.ok) return e.json();
          })
          .then(async (data) => {
            localStorage.setItem("accountToken", data.token);
            localStorage.removeItem("loginState");
            localStorage.removeItem("googleToken");
            await fetch(url + "/api/Staffs/Check", {
              headers: {
                Authorization: "Bearer " + data.token,
              },
            })
              .then((t) => t.ok && t.json())
              .then((t) => {
                localStorage.setItem("isStaff", t);
                navigateToNewPage("/");
              })
              .catch((t) => alert(t));
            navigateToNewPage("/");
          })
          .catch((error) => console.log(error));
      };
      loginWithGoogleToken();
    } catch {
      console.log("No access token from url");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (pageLoader) setPageLoaded(true);
  });
  useEffect(() => {
    const currentWindow = new URL(
      window.location.href.replace("login#state=", "login?state=")
    );
    try {
      const googleToken = currentWindow.searchParams.get("access_token");
      if (!googleToken || googleToken.length < 10)
        throw new Error("No token retrieved, useEffect");
      setDialogueLoading(true, "Logging in with Google...");
    } catch {
      console.log("No access token from url");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setDialogueLoading(true, "Logging in...");
    const inputData = new FormData(e.target);
    const customer = {
      customerEmail: inputData.get("customerEmail")
        ? inputData.get("customerEmail")
        : "",
      customerPassword: inputData.get("customerPassword")
        ? inputData.get("customerPassword")
        : "",
    };
    await fetch(url + '/api/Auth?googletoken=""', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(customer),
    })
      .then(async (e) => e.ok && e.json())
      .then(async (e) => {
        localStorage.setItem("accountToken", e.token);
        await fetch(url + "/api/Staffs/Check", {
          headers: {
            Authorization: "Bearer " + e.token,
          },
        })
          .then((t) => t.ok && t.json())
          .then((t) => {
            localStorage.setItem("isStaff", t);
            navigateToNewPage("/");
          })
          .catch((t) => alert(t));
      })
      .catch((e) => alert(e));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setDialogueLoading(true, "Registering you in...");
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
        setDialogueLoading(true, "Account registered, logging you in...");
        await fetch(url + '/api/Auth?googletoken=""', {
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
            navigateToNewPage("/");
          })
          .catch((e) => alert(e));
      })
      .catch((e) => {
        alert(e);
        setDialogueLoading(false);
      });
  };

  const [isResgistering, setIsRegistering] = useState(true);
  return (
    <div className={`loginPage ${isLoading ? "dimmed" : ""}`}>
      <main className="loginOrRegister">
        <div
          className={`loginPage ${
            !isResgistering ? "activePage" : "inactivePage"
          }`}
        >
          <h1 className="pageHeader">Already have an account? Sign in!</h1>
          <button
            className="activatePage"
            onClick={() => setIsRegistering(() => !isResgistering)}
          >
            Sign In
          </button>
          <form id="login-form" onSubmit={handleLogin}>
            <h2 className="formHeader">Enter your login credentials</h2>
            <label htmlFor="login-email">Email address</label>
            <input
              type="text"
              name="customerEmail"
              id="login-email"
              placeholder="Enter your email address"
              value={loginInfo.email}
              onChange={(e) =>
                setLoginInfo(() => ({ ...loginInfo, email: e.target.value }))
              }
            />
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              name="customerPassword"
              id="login-password"
              placeholder="Enter your password"
              onChange={(e) =>
                setLoginInfo(() => ({ ...loginInfo, password: e.target.value }))
              }
            />
            <button type="submit" onSubmit={(e) => handleLogin(e)}>
              Sign in
            </button>
            <button
              onClick={() => {
                loginWithGoogle();
              }}
              type="button"
              id="signinWithGoogle"
            >
              Sign in with Google
            </button>
          </form>
        </div>
        <div
          className={`resisterPage ${
            isResgistering ? "activePage" : "inactivePage"
          }`}
        >
          <h1 className="pageHeader">Don't have an account? Sign up now</h1>
          <button
            className="activatePage"
            onClick={() => setIsRegistering(() => !isResgistering)}
          >
            Sign Up
          </button>
          <form onSubmit={(e) => handleRegister(e)} id="register-form">
            <h2 className="formHeader">
              Please provide the neccessary information to create an account
            </h2>
            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              name="customerEmail"
              placeholder="youremailaddress@domain.com"
              id="register-email"
              value={registerInfo.email}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  email: e.target.value,
                }))
              }
            />
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              placeholder="tempPassword"
              name="customerPassword"
              id="register-password"
              value={registerInfo.password}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  password: e.target.value,
                }))
              }
            />
            <label htmlFor="register-fname">First Name</label>
            <input
              type="text"
              name="customerFname"
              id="register-fname"
              placeholder="First Name"
              value={registerInfo.fname}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  fname: e.target.value,
                }))
              }
            />
            <label htmlFor="register-lname">Last Name</label>
            <input
              type="text"
              name="customerLname"
              id="register-lname"
              placeholder="Last Name"
              value={registerInfo.lname}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  lname: e.target.value,
                }))
              }
            />
            <label htmlFor="register-city">City</label>
            <input
              type="text"
              name="customerCity"
              id="register-city"
              placeholder="Preferred Delivery City"
              value={registerInfo.city}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  city: e.target.value,
                }))
              }
            />
            <label htmlFor="register-country">Country</label>
            <select
              name="customerCountry"
              id="register-country"
              value={registerInfo.country}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  country: e.target.value,
                }))
              }
            >
              <optgroup className="countryGroup">
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antartica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegowina">
                  Bosnia and Herzegowina
                </option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">
                  British Indian Ocean Territory
                </option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">
                  Central African Republic
                </option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos Islands">Cocos (Keeling) Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo">
                  Congo, the Democratic Republic of the
                </option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cota D'Ivoire">Cote d'Ivoire</option>
                <option value="Croatia">Croatia (Hrvatska)</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="East Timor">East Timor</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands">
                  Falkland Islands (Malvinas)
                </option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="France Metropolitan">
                  France, Metropolitan
                </option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">
                  French Southern Territories
                </option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard and McDonald Islands">
                  Heard and Mc Donald Islands
                </option>
                <option value="Holy See">Holy See (Vatican City State)</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran (Islamic Republic of)</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Democratic People's Republic of Korea">
                  Korea, Democratic People's Republic of
                </option>
                <option value="Korea">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao">Lao People's Democratic Republic</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">
                  Libyan Arab Jamahiriya
                </option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macau">Macau</option>
                <option value="Macedonia">
                  Macedonia, The Former Yugoslav Republic of
                </option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">
                  Micronesia, Federated States of
                </option>
                <option value="Moldova">Moldova, Republic of</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">
                  Netherlands Antilles
                </option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">
                  Northern Mariana Islands
                </option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Kitts and Nevis">
                  Saint Kitts and Nevis
                </option>
                <option value="Saint LUCIA">Saint LUCIA</option>
                <option value="Saint Vincent">
                  Saint Vincent and the Grenadines
                </option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">
                  Sao Tome and Principe
                </option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia (Slovak Republic)</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia">
                  South Georgia and the South Sandwich Islands
                </option>
                <option value="Span">Spain</option>
                <option value="SriLanka">Sri Lanka</option>
                <option value="St. Helena">St. Helena</option>
                <option value="St. Pierre and Miguelon">
                  St. Pierre and Miquelon
                </option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard">Svalbard and Jan Mayen Islands</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syrian Arab Republic</option>
                <option value="Taiwan">Taiwan, Province of China</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania, United Republic of</option>
                <option value="Thailand">Thailand</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos">
                  Turks and Caicos Islands
                </option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">
                  United States Minor Outlying Islands
                </option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Viet Nam</option>
                <option value="Virgin Islands (British)">
                  Virgin Islands (British)
                </option>
                <option value="Virgin Islands (U.S)">
                  Virgin Islands (U.S.)
                </option>
                <option value="Wallis and Futana Islands">
                  Wallis and Futuna Islands
                </option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Serbia">Serbia</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </optgroup>
            </select>
            <label htmlFor="register-segment">Segment</label>
            <input
              type="text"
              name="customerSegment"
              id="register-segment"
              value={registerInfo.segment}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  segment: e.target.value,
                }))
              }
            />
            <label htmlFor="register-street">Street</label>
            <input
              type="text"
              name="customerStreet"
              id="register-street"
              placeholder="Street"
              value={registerInfo.street}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  street: e.target.value,
                }))
              }
            />
            <label htmlFor="register-state">State</label>
            <input
              type="text"
              name="customerState"
              id="register-state"
              value={registerInfo.state}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  state: e.target.value,
                }))
              }
              placeholder="State"
            />
            <label htmlFor="register-zip">Zipcode</label>
            <input
              type="number"
              name="customerZipcode"
              id="register-zip"
              placeholder="0"
              value={registerInfo.zip}
              onChange={(e) =>
                setRegisterInfo(() => ({
                  ...registerInfo,
                  zip: e.target.value,
                }))
              }
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </main>
      <div className="animation-area">
        <ul className="box-area">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
