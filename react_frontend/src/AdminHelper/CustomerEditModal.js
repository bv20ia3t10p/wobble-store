import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useEffect, useState } from "react";
import { url } from "../utils";

const getCustomer = async (setCustomer, customerId) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Customer/" + customerId, {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
  })
    .then((e) => e.ok && e.json())
    .then((e) => setCustomer(() => e));
};

const updateCustomer = async (setCustomer, customer, showSnack) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Customer/", {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
    method: "PUT",
  })
    .then((e) => e.ok && e.json())
    .then((e) => {
      showSnack();
      setCustomer(() => e);
    });
};

const deleteCustomer = async (customer) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Customer/" + customer.customerId, {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((e) => e.ok)
    .then(() => window.location.reload());
};

const CustomerEditModal = (props) => {
  const { customerId, isEditingCustomer, setIsEditingCustomer, showSnack } =
    props;
  const [showPassword, setShowPassword] = React.useState(false);
  const [customer, setCustomer] = useState();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    getCustomer(setCustomer, customerId);
  }, [customerId]);
  return (
    <div>
      {customer && (
        <Modal
          open={isEditingCustomer}
          onClose={() => setIsEditingCustomer(() => false)}
        >
          <div className="editCustomerModal">
            <Typography variant="h5">Customer Information</Typography>
            <Typography variant="h6">
              Customer ID #{customer.customerId}
            </Typography>
            <IconButton onClick={() => deleteCustomer(customer)}>
              <Typography
                variant="h6"
                className="editCustomerDeleteTitle"
                color="error"
              >
                Delete customer <DeleteIcon color="error" />
              </Typography>
            </IconButton>
            <TextField
              className="searchCustomerEmail"
              label="Email Address"
              disabled={true}
              value={customer.customerEmail}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerEmail: e.target.value,
                }))
              }
            />
            <TextField
              className="searchCustomerFname"
              label="First name"
              value={customer.customerFname}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerFname: e.target.value,
                }))
              }
            />
            <TextField
              className="searchCustomerLname"
              label="Last Name"
              value={customer.customerLname}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerEmail: e.target.value,
                }))
              }
            />
            <FormControl className="customerSegmentContainer">
              <InputLabel>Segment</InputLabel>
              <Select
                value={customer.customerSegment}
                onChange={(e) =>
                  setCustomer(() => ({
                    ...customer,
                    customerSegment: e.target.value,
                  }))
                }
                className="customerSegment"
                label={"Segment"}
              >
                <MenuItem value="">Any</MenuItem>
                {["Consumer", "Home Office", "Corporate"].map((text, key) => (
                  <MenuItem key={key} value={text}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              className="serachCustomerState"
              label="State"
              value={customer.customerState}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerEmail: e.target.value,
                }))
              }
            />
            <TextField
              className="searchCustomerStreet"
              label="Street"
              value={customer.customerStreet}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerStreet: e.target.value,
                }))
              }
            />
            <TextField
              className="searchCustomerZipcode"
              label="Search By Customer Zipcode"
              type="number"
              value={customer.customerZipcode}
              onChange={(e) =>
                setCustomer(() => ({
                  ...customer,
                  customerZipcode: e.target.value,
                }))
              }
            />
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Change password for customer
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                value={customer.customerPassword}
                onChange={(e) =>
                  setCustomer(() => ({
                    ...customer,
                    customerPassword: e.target.value,
                  }))
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div className="controls">
              <Button variant="outlined">Cancel</Button>
              <Button
                variant="contained"
                onClick={() => updateCustomer(setCustomer, customer, showSnack)}
              >
                Apply
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerEditModal;
