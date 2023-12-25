import React, { useEffect, useState } from "react";
import { loadUserInfo } from "./Cart";
import { url } from "./utils";
import { useLoadingContext } from "./LoadingContext";
import "./stylesheets/dashboard.css";
import AccountSidebar from "./AccountSidebar";

const initialState = {
  customerCity: "",
  customerCountry: "",
  customerSegment: "Consumer",
  customerStreet: "",
  customerState: "",
  customerZipcode: "",
  customerId: 0,
  customerEmail: "",
  customerPassword: "",
  customerFname: "",
  customerLname: "",
};

const Dashboard = () => {
  const [updateInfo, setUpdateInfo] = useState(initialState);
  const [loadedInfo, setLoadedInfo] = useState(initialState);
  const [rePassword, setRePassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const { setDialogueLoading, isLoading, setPageLoaded } = useLoadingContext();
  useEffect(() => {
    loadUserInfo(setLoadedInfo, setPageLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleUserInfoUpdate = async (e) => {
    e.preventDefault();
    let updateUser = updateInfo;
    const accountToken = localStorage.getItem("accountToken");
    updateUser = {
      customerCity: updateInfo.customerCity
        ? updateInfo.customerCity
        : loadedInfo.customerCity,
      customerCountry: updateInfo.customerCountry
        ? updateInfo.customerCountry
        : loadedInfo.customerCountry,
      customerSegment: updateInfo.customerSegment
        ? updateInfo.customerSegment
        : loadedInfo.customerSegment,
      customerStreet: updateInfo.customerStreet
        ? updateInfo.customerStreet
        : loadedInfo.customerStreet,
      customerState: updateInfo.customerState
        ? updateInfo.customerState
        : loadedInfo.customerState,
      customerZipcode: updateInfo.customerZipcode
        ? parseInt(updateInfo.customerZipcode)
        : parseInt(loadedInfo.customerZipcode),
      customerId: loadedInfo.customerId,
      customerEmail: loadedInfo.customerEmail,
      customerPassword: isEditingPassword
        ? updateInfo.customerPassword
        : loadedInfo.customerPassword,
      customerFname: updateInfo.customerFname
        ? updateInfo.customerFname
        : loadedInfo.customerFname,
      customerLname: updateInfo.customerLname
        ? updateInfo.customerLname
        : loadedInfo.customerLname,
    };
    if (isEditingPassword) {
      if (rePassword !== updateInfo.customerPassword) {
        alert("Re-entered password does not match");
        return;
      }
    }
    if (
      Object.values(updateUser).filter(
        (e) => !e || e.length === 0 || !typeof e || e === 0
      ).length > 0
    ) {
      alert("No field can be null or 0");
      return;
    }
    setDialogueLoading(true, "Processing your request");
    await fetch(url + "/api/Customer/Update", {
      method: "PUT",
      body: JSON.stringify(updateUser),
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
      .then((e) => {
        console.log(e);
        setLoadedInfo(() => e);
        setUpdateInfo(() => initialState);
        setDialogueLoading(false);
      })
      .catch((e) => {
        alert(e);
        setUpdateInfo(() => initialState);
        setDialogueLoading(false);
      });
  };
  return (
    <main className={`dashboardMain ${isLoading ? "dimmed" : ""}`}>
      <AccountSidebar />
      <h2 className="title">Your current account information</h2>
      <form
        className="userInfoMain"
        onReset={() => {
          setIsEditingPassword(() => false);
          setUpdateInfo(() => initialState);
        }}
        onSubmit={(e) => handleUserInfoUpdate(e)}
      >
        <div className="fname">
          <label htmlFor="customerFname">First Name</label>
          <input
            value={updateInfo.customerFname}
            placeholder={loadedInfo.customerFname}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerFname: e.target.value,
              }))
            }
            type="text"
            name="customerFname"
            id="customerFname"
          />
        </div>
        <div className="lname">
          <label htmlFor="customerLname">Last name</label>
          <input
            type="text"
            name="customerLname"
            id="customerLname"
            value={updateInfo.customerLname}
            placeholder={loadedInfo.customerLname}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerLname: e.target.value,
              }))
            }
          />
        </div>
        <div className="state">
          <label htmlFor="customerState">State</label>
          <input
            type="text"
            name="customerState"
            id="customerState"
            value={updateInfo.customerState}
            placeholder={loadedInfo.customerState}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerState: e.target.value,
              }))
            }
          />
        </div>
        <div className="city">
          <label htmlFor="customerCity">City</label>
          <input
            type="text"
            name="customerCity"
            id="customerCity"
            value={updateInfo.customerCity}
            placeholder={loadedInfo.customerCity}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerCity: e.target.value,
              }))
            }
          />
        </div>
        <div className="country">
          <label htmlFor="customerCountry">Country</label>
          <input
            type="text"
            name="customerCountry"
            id="customerCountry"
            value={updateInfo.customerCountry}
            placeholder={loadedInfo.customerCountry}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerCountry: e.target.value,
              }))
            }
          />
        </div>
        <div className="street">
          <label htmlFor="customerStreet">Street</label>
          <input
            type="text"
            name="customerStreet"
            id="customerStreet"
            value={updateInfo.customerStreet}
            placeholder={loadedInfo.customerStreet}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerStreet: e.target.value,
              }))
            }
          />
        </div>
        <div className="zipcode">
          <label htmlFor="customerZipcode">Zipcode</label>
          <input
            type="number"
            name="customerZipcode"
            id="customerZipcode"
            value={updateInfo.customerZipcode}
            placeholder={loadedInfo.customerZipcode}
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerZipcode: e.target.value,
              }))
            }
          />
        </div>
        <div className="email">
          <h3>Email address</h3>
          <p id="customerEmail">{loadedInfo.customerEmail}</p>
        </div>
        <div className={`changePassword ${isEditingPassword ? "hidden" : ""}`}>
          <h3>Changing your password?</h3>
          <button
            type="button"
            onClick={() => {
              setIsEditingPassword(() => true);
            }}
          >
            Change password
          </button>
        </div>
        <div className={`newPassword ${isEditingPassword ? "" : "hidden"}`}>
          <label htmlFor="customerPassword">Enter new password:</label>
          <input
            type="password"
            name="customerPassword"
            id="customerPassword"
            value={updateInfo.customerPassword}
            placeholder="Enter new password"
            onChange={(e) =>
              setUpdateInfo(() => ({
                ...updateInfo,
                customerPassword: e.target.value,
              }))
            }
          />
        </div>
        <div className={`rePassword ${isEditingPassword ? "" : "hidden"}`}>
          <label htmlFor="rePassword">Re-enter password:</label>
          <input
            type="password"
            name="rePassword"
            id="rePassword"
            value={rePassword}
            placeholder="Re-enter your password"
            onChange={(e) => setRePassword(() => e.target.value)}
          />
        </div>
        <button type="reset">Reset</button>
        <button type="submit">Save changes</button>
      </form>
    </main>
  );
};

export default Dashboard;
