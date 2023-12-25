import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, InputLabel } from "@mui/material";
import { connect, fund } from "./handleWeb3.js";
import { navigateToNewPage, url } from "./utils";
import { useLoadingContext } from "./LoadingContext.js";
import Order from "./Order.js";
import "./stylesheets/orderConfirm.css";

const confirmPayment = async (
  action,
  type,
  setDialogueLoading,
  setOrder,
  order
) => {
  try {
    const currentWindow = new URL(window.location.href);
    const accountToken = localStorage.getItem("accountToken");
    const searchParams = currentWindow.searchParams;
    const orderId = searchParams.get("orderId");
    if (!orderId) throw new Error("Invalid url");
    if (!accountToken || accountToken.length < 10)
      throw new Error("No account token");
    setDialogueLoading(true, "Processing your request...");
    if (action !== "Cancel" && type === "WEB3") await confirmWeb3(order);
    const updateOrderUrl = url + "/api/Order/Customer";
    await fetch(updateOrderUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accountToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        type: type,
        orderStatus: action === "Cancel" ? "CANCELED" : "PAYMENT_REVIEW",
      }),
    })
      .then(async (e) => {
        if (e.ok) return e.json();
        else
          return e.text().then((text) => {
            throw new Error(text);
          });
      })
      .then((e) => {
        setOrder(() => e);
        setDialogueLoading(false);
      })
      .catch((e) => alert(e));
  } catch (e) {
    console.log(e);
    setDialogueLoading(false);
  }
};

const confirmWeb3 = async (loadedOrder) => {
  const currentWindow = new URL(window.location.href);
  const searchParams = currentWindow.searchParams;
  const orderId = searchParams.get("orderId");
  if (!orderId) throw new Error("Invalid url");
  await fund(loadedOrder);
};

const getOrder = async (setOrder, setPageLoaded, setIsWeb3Available) => {
  await connect(setIsWeb3Available);
  try {
    const currentWindow = new URL(window.location.href);
    const searchParams = currentWindow.searchParams;
    const orderId = searchParams.get("orderId");
    const accountToken = localStorage.getItem("accountToken");
    if (!orderId) throw new Error("Invalid url");
    if (!accountToken || accountToken.length < 10)
      throw new Error("No account token found, please login");
    await fetch(url + `/api/Order/${orderId}/Customer`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accountToken,
      },
    })
      .then(async (e) => {
        if (e.ok) return e.json();
        else
          return e.text().then((text) => {
            throw new Error(text);
          });
      })
      .then((e) => {
        setOrder(() => e);
        setPageLoaded(true);
      });
  } catch (e) {
    alert(e);
    navigateToNewPage("/");
  }
};

const OrderConfirmation = () => {
  const [paymentOpt, setPaymentOpt] = useState("CASH");
  const [order, setOrder] = useState();
  const { setDialogueLoading, setPageLoaded, isLoading } = useLoadingContext();
  const [action, setAction] = useState("Confirm");
  const [isNoActionAvailable, setIsNoActionAvailable] = useState(false);
  const [isWeb3Available, setIsWeb3Available] = useState(false);
  useEffect(() => {
    getOrder(setOrder, setPageLoaded, setIsWeb3Available);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!order) return;
    switch (order.orderStatus) {
      case "CANCELED":
      case "CLOSED":
      case "COMPLETE":
      case "SUSPECTED_FRAUD":
        setIsNoActionAvailable(() => true);
        break;
      case "PAYMENT_REVIEW":
      case "PROCESSING":
        setAction(() => "Cancel");
        setIsNoActionAvailable(() => false);
        break;
      default:
        setAction(() => "Confirm");
        setIsNoActionAvailable(() => false);
    }
  }, [order]);
  return (
    <main className={`orderConfirmMain ${isLoading ? "dimmed" : ""}`}>
      {order && <Order order={order} />}
      {!isNoActionAvailable && (
        <>
          <FormControl>
            <InputLabel>Payment options</InputLabel>
            <Select
              value={paymentOpt}
              onChange={(e) => setPaymentOpt(() => e.target.value)}
              className="sortOptions"
              label={"Payment options"}
            >
              {isWeb3Available && <MenuItem value="WEB3">Metamask</MenuItem>}
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
              <MenuItem value="DEBIT">Debit </MenuItem>
              <MenuItem value="PAYMENT">Direct </MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              confirmPayment(
                "Cancel",
                paymentOpt,
                setDialogueLoading,
                setOrder,
                order
              );
            }}
            variant="contained"
            color="error"
          >
            Cancel Order
          </Button>
          {action && action === "Confirm" && (
            <Button
              onClick={() => {
                confirmPayment(
                  action,
                  paymentOpt,
                  setDialogueLoading,
                  setOrder,
                  order
                );
              }}
              variant="contained"
              color="warning"
            >
              Confirm
            </Button>
          )}
        </>
      )}
    </main>
  );
};

export default OrderConfirmation;
