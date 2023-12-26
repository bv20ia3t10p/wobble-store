import React, { useEffect, useState } from "react";
import { url } from "../utils";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllProducts } from "../Home";

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[700] : blue[200]
      };
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `
);

const StyledButton = styled("button")(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 0;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
      background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
      color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
        border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
      }
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
      background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
      color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    }
  
    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `
);

const getOrderWithDetails = async (setOrder, id) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Order/WithDetails/" + id, {
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then((e) => e.ok && e.json())
    .then((e) => setOrder(() => e))
    .catch((e) => alert(e));
};

const addOrderDetail = async (setOrder, order, productCardId, quantity) => {
  const accountToken = localStorage.getItem("accountToken");
  const requestBody = {
    productCardId: productCardId,
    orderId: order.orderId,
    orderItemQuantity: quantity,
    customerId: order.customerId,
  };
  await fetch(url + "/api/OrderDetail", {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestBody),
  })
    .then((e) => e.ok && e.json())
    .then(async () => {
      await fetch(url + "/api/Order/WithDetails/" + order.orderId, {
        headers: {
          Authorization: "Bearer " + accountToken,
        },
      })
        .then((t) => t.ok && t.json())
        .then((t) => setOrder(() => t))
        .catch((t) => alert(t));
    })
    .catch((e) => alert(e));
};

const deleteOrderDetail = async (setOrder, order, orderDetailId) => {
  const accountToken = localStorage.getItem("accountToken");

  await fetch(url + "/api/OrderDetail/" + orderDetailId, {
    headers: {
      Authorization: "Bearer " + accountToken,
    },
    method: "DELETE",
  })
    .then((e) => e.ok)
    .then(async () => {
      await fetch(url + "/api/Order/WithDetails/" + order.orderId, {
        headers: {
          Authorization: "Bearer " + accountToken,
        },
      })
        .then((t) => t.ok && t.json())
        .then((t) => setOrder(() => t))
        .catch((t) => alert(t));
    })
    .catch((e) => alert(e));
};

const updateOrderDetail = async (
  setOrder,
  order,
  orderDetailId,
  newProduct,
  newQuant
) => {
  const accountToken = localStorage.getItem("accountToken");
  const requestBody = {
    productCardId: newProduct,
    orderItemQuantity: newQuant,
  };
  await fetch(url + "/api/OrderDetail/" + orderDetailId, {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    method: "PUT",
  })
    .then((e) => e.ok && e.json())
    .then(async () => {
      await fetch(url + "/api/Order/WithDetails/" + order.orderId, {
        headers: {
          Authorization: "Bearer " + accountToken,
        },
      })
        .then((t) => t.ok && t.json())
        .then((t) => setOrder(() => t))
        .catch((t) => alert(t));
    })
    .catch((e) => alert(e));
};

const updateOrderInfo = async (newOrder, setOrder) => {
  const accountToken = localStorage.getItem("accountToken");
  newOrder = {
    ...newOrder,
    orderDate: newOrder.orderDate.toISOString(),
    shippingDate: newOrder.shippingDate.toISOString(),
  };
  await fetch(url + "/api/Order/Status", {
    method: "PUT",
    body: JSON.stringify(newOrder),
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then((e) => e.ok && e.json())
    .then(async () => {
      await fetch(url + "/api/Order/WithDetails/" + newOrder.orderId, {
        headers: {
          Authorization: "Bearer " + accountToken,
        },
      })
        .then((t) => t.ok && t.json())
        .then((t) => setOrder(() => t))
        .catch((t) => alert(t));
    })
    .catch((e) => alert(e));
};

const deleteOrder = async (order, setIsOpeningModal) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Order/" + order.orderId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then((e) => e.ok)
    .then(() => {
      setIsOpeningModal(() => false);
      window.location.reload();
    })
    .catch((e) => alert(e));
};
const CustomNumberInput = React.forwardRef(function CustomNumberInput(
  props,
  ref
) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

const OrderEditModal = (props) => {
  const { orderId, isEditingOrder, setIsEditingOrder } = props;
  const [products, setProducts] = useState([]);
  const [isChangingItem, setIsChangingItem] = useState(true);
  const [currentProduct, setCurrentProduct] = useState();
  const [currentQuantity, setCurrentQuantity] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const [currentOrderItemID, setCurrentOrderItemID] = useState();
  const [order, setOrder] = useState();
  useEffect(() => {
    getOrderWithDetails(setOrder, orderId);
  }, [orderId]);
  useEffect(() => {
    getAllProducts(setProducts);
  }, []);
  const handleRowClick = (row) => {
    setIsChangingItem(() => true);
    setCurrentOrderItemID(() => row.id);
    setCurrentProduct(() =>
      products.find((e) => e.productCardId === row.productCardId)
    );
    setCurrentQuantity(() => row.orderItemQuantity);
  };
  return (
    <>
      <Modal open={isEditingOrder} onClose={setIsEditingOrder}>
        <div>
          {order && (
            <Box className="orderEditModal">
              <Typography variant="h3">Order #{order.orderId}</Typography>
              <Typography variant="h6">{order.customerEmail}</Typography>
              <Typography variant="h6">Order total: ${order.total}</Typography>
              <IconButton
                className="deleteOrder"
                color="error"
                onClick={() => {
                  deleteOrder(order, setIsEditingOrder);
                }}
              >
                <Typography variant="h6" className="delete">
                  DELETE ORDER
                </Typography>
                <DeleteIcon />
              </IconButton>
              <DatePicker
                label="Order date"
                value={dayjs(order.orderDate)}
                onChange={(e) => setOrder(() => ({ ...order, orderDate: e }))}
              />
              <DatePicker
                label="Shipping date"
                value={dayjs(order.shippingDate)}
                onChange={(e) =>
                  setOrder(() => ({ ...order, shippingDate: e }))
                }
              />
              <FormControl className="selectOrderStatus">
                <InputLabel>Order status</InputLabel>
                <Select
                  value={order.orderStatus}
                  onChange={(e) =>
                    setOrder(() => ({ ...order, orderStatus: e.target.value }))
                  }
                  className="orderStatus"
                  label={"Order status"}
                >
                  {[
                    "CANCELED",
                    "CLOSED",
                    "COMPLETE",
                    "ON_HOLD",
                    "PAYMENT_REVIEW",
                    "PENDING",
                    "PENDING_PAYMENT",
                    "PROCESSING",
                    "SUSPECTED_FRAUD",
                  ].map((text, key) => {
                    return (
                      <MenuItem key={key} value={text}>
                        {text}
                      </MenuItem>
                    );
                  })}
                  <MenuItem value="">Any</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="paymentTypeContainer">
                <InputLabel>Payment type</InputLabel>
                <Select
                  value={order.type}
                  onChange={(e) =>
                    setOrder(() => ({ ...order, type: e.target.value }))
                  }
                  className="paymentType"
                  label={"Payment type"}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="TRANSFER">Transfer</MenuItem>
                  <MenuItem value="DEBIT">Debit </MenuItem>
                  <MenuItem value="PAYMENT">Direct </MenuItem>
                  <MenuItem value="WEB3">Metamask </MenuItem>
                </Select>
              </FormControl>
              <FormControl className="shippingModeContainer">
                <InputLabel>Shipping mode</InputLabel>
                <Select
                  value={order.shippingMode}
                  onChange={(e) =>
                    setOrder(() => ({ ...order, shippingDate: e.target.value }))
                  }
                  className="shippingMode"
                  label={"Shipping mode"}
                >
                  <MenuItem value="">Any</MenuItem>
                  {[
                    "First Class",
                    "Same Day",
                    "Second Class",
                    "Standard Class",
                  ].map((text, key) => (
                    <MenuItem key={key} value={text}>
                      {text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="deliveryStatusContainer">
                <InputLabel>Delivery status</InputLabel>
                <Select
                  value={order.deliveryStatus}
                  onChange={(e) =>
                    setOrder(() => ({
                      ...order,
                      deliveryStatus: e.target.value,
                    }))
                  }
                  className="deliveryStatus"
                  label={"Delivery status"}
                >
                  <MenuItem value="">Any</MenuItem>
                  {[
                    "Advance shipping",
                    "Late delivery",
                    "Shipping canceled",
                    "Shipping on time",
                  ].map((text, key) => (
                    <MenuItem key={key} value={text}>
                      {text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="addIcon"
                onClick={() => {
                  setIsCreating(() => true);
                }}
                color={"success"}
              >
                Add new item
              </Button>
              <Modal
                open={isCreating}
                onClose={() => setIsCreating(() => false)}
              >
                <div className="orderItemChange">
                  <Typography variant="h5">Add new order detail</Typography>
                  {products && (
                    <Autocomplete
                      options={products}
                      getOptionLabel={(option) => option.productName}
                      onChange={(e, newVal) => setCurrentProduct(() => newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search and select for prodcut"
                          variant="standard"
                        />
                      )}
                    />
                  )}
                  <Typography variant="h6">Order item quantity</Typography>
                  <CustomNumberInput
                    placeholder="Enter quantity"
                    value={currentQuantity}
                    onChange={(event, val) => setCurrentQuantity(() => val)}
                  />
                  <div className="controls">
                    <Button
                      variant="outlined"
                      onClick={() => setIsCreating(() => false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        addOrderDetail(
                          setOrder,
                          order,
                          currentProduct.productCardId,
                          currentQuantity
                        );
                        setIsCreating(() => false);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </Modal>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Product ID</TableCell>
                      <TableCell align="right">Product Name</TableCell>
                      <TableCell align="right">Product Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.details.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => handleRowClick(row)}
                        >
                          {row.productCardId}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleRowClick(row)}
                        >
                          {row.productName}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleRowClick(row)}
                        >
                          {row.productPrice}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleRowClick(row)}
                        >
                          {row.orderItemQuantity}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleRowClick(row)}
                        >
                          {row.orderItemTotal}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              deleteOrderDetail(setOrder, order, row.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentOrderItemID && (
                      <Modal
                        open={isChangingItem}
                        onClose={() => setIsChangingItem(() => false)}
                      >
                        <div className="orderItemChange">
                          <Typography variant="h5">
                            Edit order item values
                          </Typography>
                          {products && (
                            <Autocomplete
                              options={products}
                              getOptionLabel={(option) => option.productName}
                              onChange={(e, newVal) =>
                                setCurrentProduct(() => newVal)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Changing product?"
                                  variant="standard"
                                />
                              )}
                            />
                          )}
                          <Typography variant="h6">New quantity</Typography>
                          <CustomNumberInput
                            placeholder="Enter new quantity"
                            value={currentQuantity}
                            onChange={(event, val) =>
                              setCurrentQuantity(() => val)
                            }
                          />
                          <div className="controls">
                            <Button
                              variant="outlined"
                              onClick={() => setIsChangingItem(() => false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => {
                                updateOrderDetail(
                                  setOrder,
                                  order,
                                  currentOrderItemID,
                                  currentProduct.productCardId,
                                  currentQuantity
                                );
                                setIsChangingItem(() => false);
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="controls">
                <Button variant="outlined">Reset</Button>
                <Button variant="contained">Update</Button>
              </div>
            </Box>
          )}
        </div>
      </Modal>
    </>
  );
};
OrderEditModal.propTypes = {
  orderId: PropTypes.number.isRequired,
  isEditingOrder: PropTypes.bool.isRequired,
  setIsEditingOrder: PropTypes.func.isRequired,
};
export default OrderEditModal;
