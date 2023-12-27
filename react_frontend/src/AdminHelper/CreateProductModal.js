import React, { useEffect, useState } from "react";
import { loadCategories, loadDepartments } from "./AdminProducts";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Modal,
} from "@mui/material";
import { url } from "../utils";

const createProduct = async (
  categoryId,
  departmentId,
  productName,
  productPrice,
  productStatus,
  productDescription,
  setIsCreatingProduct
) => {
  const accountToken = localStorage.getItem("accountToken");
  const newProduct = {
    departmentId,
    categoryId,
    productName,
    productPrice,
    productStatus: productStatus ? true : false,
    productDescription,
  };
  await fetch(url + "/api/Products", {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newProduct),
  })
    .then((e) => e.ok && e.json())
    .then(() => {
      alert("Successs");
      setIsCreatingProduct(false);
    });
};

const CreateProductModal = (props) => {
  const { isCreatingProduct, setIsCreatingProduct } = props;
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStatus, setProductStatus] = useState(false);
  const [productPrice, setProductPrice] = useState(0);
  useEffect(() => {
    loadDepartments(setDepartments);
    loadCategories(setCategories);
  }, []);
  return (
    <Modal
      open={isCreatingProduct}
      onClose={() => setIsCreatingProduct(() => false)}
    >
      <div className="adminCreateProductModal">
        {categories && (
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.categoryName}
            onChange={(e, newVal) => setSelectedCategory(() => newVal)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Searching for category"
                variant="standard"
              />
            )}
          />
        )}
        {departments && (
          <Autocomplete
            options={departments}
            getOptionLabel={(option) => option.departmentName}
            onChange={(e, newVal) => setSelectedDepartment(() => newVal)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Searching for departments"
                variant="standard"
              />
            )}
          />
        )}
        <TextField
          className="searchCustomerFname"
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(() => e.target.value)}
        />
        <TextField
          className="createProductPrice"
          label="Product price"
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(() => e.target.value)}
        />
        <TextField
          label="Product description"
          value={productDescription}
          onChange={(e) => setProductDescription(() => e.target.value)}
        />
        <FormControl className="productStatusContainer">
          <InputLabel>Product Status</InputLabel>
          <Select
            value={productStatus}
            onChange={(e) => setProductStatus(() => e.target.value)}
            className="productStatus"
            label={"Product status"}
          >
            <MenuItem value={0}>Not available</MenuItem>
            <MenuItem value={1}>Available</MenuItem>
          </Select>
        </FormControl>
        <div className="controls">
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedCategory({});
              setSelectedDepartment({});
              setProductDescription("");
              setProductPrice(0);
              setProductName("");
              setProductStatus(() => false);
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedCategory) return;
              if (!selectedDepartment) return;
              if (!productName) return;
              if (!productStatus) return;
              if (!productPrice) return;
              createProduct(
                selectedCategory.categoryId,
                selectedDepartment.departmentId,
                productName,
                productPrice,
                productStatus,
                productDescription,
                setIsCreatingProduct
              );
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProductModal;
