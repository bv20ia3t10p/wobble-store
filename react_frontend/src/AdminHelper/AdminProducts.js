import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import { url } from "../utils";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import { Button, InputLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Autocomplete from "@mui/material/Autocomplete";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
// import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
// import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
// import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import "../stylesheets/adminOrder.css";
import "../stylesheets/adminProduct.css";
import { getAllProducts } from "../Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
function EnhancedTableHead(props) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all orders",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  //   onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableToolbar(props) {
  const {
    // numSelected,
    handleOpenModal,
    handleCreateProduct,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(
        //       theme.palette.primary.main,
        //       theme.palette.action.activatedOpacity
        //     ),
        // }),
      }}
    >
      {/* {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : ( */}
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Products
      </Typography>
      {/* )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : ( */}
      <IconButton onClick={handleCreateProduct}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Tooltip title="Filter list">
        <IconButton onClick={handleOpenModal}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      {/* )} */}
    </Toolbar>
  );
}

const headCells = [
  {
    id: "productCardId",
    numeric: true,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "categoryId",
    numeric: false,
    disablePadding: false,
    label: "C.ID",
  },
  {
    id: "categoryName",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "departmentId",
    numeric: true,
    disablePadding: false,
    label: "D.ID",
  },
  {
    id: "departmentName",
    numeric: false,
    disablePadding: false,
    label: "Department",
  },

  {
    id: "productPrice",
    numeric: true,
    disablePadding: false,
    label: "Product Price($)",
  },
  {
    id: "productSoldQuantity",
    numeric: true,
    disablePadding: false,
    label: "Sold",
  },
  {
    id: "productStatus",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
const reloadProductsWithOpts = async (
  setOrders,
  setDialogueLoading,
  page,
  rowsPerPage,
  departmentId,
  categoryId,
  priceRange,
  productStatus,
  soldRange,
  sortOpt,
  ProductName,
  setPagingInfo
) => {
  try {
    setDialogueLoading(true, "Applying your search...");
    let queryUrl = new URL(url + "/api/Products");
    queryUrl.searchParams.append(sortOpt, true);
    queryUrl.searchParams.append("PageSize", rowsPerPage);
    queryUrl.searchParams.append("PageNumber", page);
    if (departmentId)
      queryUrl.searchParams.append("DepartmentId", departmentId);
    if (categoryId) queryUrl.searchParams.append("CategoryId", categoryId);
    if (priceRange) {
      queryUrl.searchParams.append("productPriceGt", priceRange[0]);
      queryUrl.searchParams.append("productPriceLs", priceRange[1]);
    }
    if (productStatus) {
      queryUrl.searchParams.append("ProductStatus", productStatus);
    }
    if (soldRange) {
      queryUrl.searchParams.append("productSoldQuantityGt", soldRange[0]);
      queryUrl.searchParams.append("productSoldQuantityLs", soldRange[1]);
    }
    if (sortOpt)
      queryUrl.searchParams.append(
        sortOpt.split("_")[0],
        sortOpt.split("_")[1]
      );
    if (ProductName) queryUrl.searchParams.append("ProductName", ProductName);
    console.log(queryUrl.href);
    await fetch(queryUrl, {
      method: "GET",
    })
      .then((e) => {
        if (e.ok) return e.json();
      })
      .then((e) => {
        console.log(e);
        setOrders(() => e.data);
        setDialogueLoading(false);
        if (setPagingInfo) setPagingInfo(() => e);
      });
  } catch (e) {
    alert(e);
    setDialogueLoading(false, "Applying your search...");
  }
};

const loadProducts = async (
  setOrders,
  setDialogueLoading,
  pageNumber,
  pageSize,
  setPagingInfo = null,
  setPageLoaded = null
) => {
  pageNumber += 1;
  setDialogueLoading(true, "Changing page...");
  await fetch(
    url + "/api/Products?pageNumber=" + pageNumber + "&pageSize=" + pageSize
  )
    .then((e) => e.ok && e.json())
    .then((e) => {
      console.log(e);
      setOrders(() => e.data);
      setDialogueLoading(false);
      setPagingInfo && setPagingInfo(() => e);
      if (setPageLoaded) setPageLoaded(true);
    })
    .catch((e) => alert(e));
};

export const loadDepartments = async (setDepartments) => {
  await fetch(url + "/api/Department")
    .then((e) => e.ok && e.json())
    .then((e) => setDepartments(() => e));
};

export const loadCategories = async (setCategories) => {
  await fetch(url + "/api/Category")
    .then((e) => e.ok && e.json())
    .then((e) => setCategories(() => e));
};

const AdminProducts = () => {
  const { setPageLoaded, setDialogueLoading, isLoading } = useLoadingContext();
  const [pagingInfo, setPagingInfo] = useState();
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  //   departmentId,
  //   categoryId,
  //   priceRange,
  //   productStatus,
  //   soldRange,
  //   sortOpt,
  const [selectedDerpartment, setSelectedDepartment] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedProductSearch, setSelectedProductSearch] = useState();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [order, setOrder] = React.useState("asc");
  const [sortOpt, setSortOpt] = useState();
  const [productStatus, setProductStatus] = useState(false);
  const [priceRange, setPriceRange] = useState([300, 2000]);
  const [soldRange, setSoldRange] = useState([300, 2000]);
  const [orderBy, setOrderBy] = React.useState("productCardId");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isOriginalList, setIsOriginalList] = useState(true);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [viewingProductId, setViewingProductId] = useState(365);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  useEffect(() => {
    loadProducts(
      setProducts,
      setDialogueLoading,
      page,
      rowsPerPage,
      setPagingInfo,
      setPageLoaded
    );
    loadDepartments(setDepartments);
    loadCategories(setCategories);
    getAllProducts(setAllProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleClick = (event, id) => {
    setViewingProductId(() => id);
    setIsEditingProduct(() => true);
  };
  const handleChangePage = (event, newPage) => {
    if (isOriginalList)
      loadProducts(setProducts, setDialogueLoading, newPage, rowsPerPage);
    else {
      reloadProductsWithOpts(
        setProducts,
        setDialogueLoading,
        newPage,
        rowsPerPage,
        selectedDerpartment ? selectedDerpartment.departmentId : null,
        selectedCategory ? selectedCategory.categoryId : null,
        priceRange,
        productStatus,
        soldRange,
        sortOpt,
        selectedProductSearch ? selectedProductSearch.productName : null,
        setPagingInfo
      );
    }
    setPage(() => newPage);
  };
  useEffect(
    () =>
      setVisibleRows(() => stableSort(products, getComparator(order, orderBy))),
    [products, order, orderBy, page, rowsPerPage]
  );
  const handleChangeRowsPerPage = (event) => {
    const newRow = event.target.value;
    if (isOriginalList)
      loadProducts(setProducts, setDialogueLoading, page, newRow);
    else {
      reloadProductsWithOpts(
        setProducts,
        setDialogueLoading,
        page,
        newRow,
        selectedDerpartment ? selectedDerpartment.departmentId : null,
        selectedCategory ? selectedCategory.categoryId : null,
        priceRange,
        productStatus,
        soldRange,
        sortOpt,
        selectedProductSearch ? selectedProductSearch.productName : null,
        setPagingInfo
      );
    }
    setRowsPerPage(() => newRow);
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  return (
    <div>
      <CreateProductModal
        isCreatingProduct={isCreatingProduct}
        setIsCreatingProduct={setIsCreatingProduct}
      />
      {viewingProductId && (
        <UpdateProductModal
          isCreatingProduct={isEditingProduct}
          setIsCreatingProduct={setIsEditingProduct}
          productId={viewingProductId}
        />
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <OrderEditModal
          orderId={viewingOrderId}
          isEditingOrder={isEditingOrder}
          setIsEditingOrder={() => setIsEditingOrder(() => false)}
        /> */}
        <div className={`adminOrdersMain ${isLoading ? "dimmed" : ""}`}>
          <Typography variant="h3" className="adminOrdersTitle">
            Product Management
          </Typography>
          <Modal
            open={isOpeningModal}
            onClose={() => setIsOpeningModal(() => false)}
          >
            <Box className="adminOrderSearch">
              <Typography variant="h5" className="title">
                Filter Options:
              </Typography>
              {allProducts && (
                <Autocomplete
                  options={allProducts}
                  getOptionLabel={(option) => option.productName}
                  onChange={(e, newVal) =>
                    setSelectedProductSearch(() => newVal)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Searching for products"
                      variant="standard"
                    />
                  )}
                />
              )}
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
                  <MenuItem value={null}>Any</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="sortOptionsContainer">
                <InputLabel>Sort options</InputLabel>
                <Select
                  value={sortOpt}
                  onChange={(e) => setSortOpt(() => e.target.value)}
                  className="sortOptions"
                  label={"Sort Options"}
                >
                  <MenuItem value="orderByIdAsc_true">
                    Order By Product Id Ascending
                  </MenuItem>
                  <MenuItem value="orderByIdAsc_false">
                    Order By Product Id Descending
                  </MenuItem>
                  <MenuItem value="orderByPriceAsc_true">
                    Order By Product Price Ascending
                  </MenuItem>
                  <MenuItem value="orderByPriceAsc_false">
                    Order By Product Price Descending
                  </MenuItem>
                  <MenuItem value="orderBySoldAsc_true">
                    Order By Product Sold Quantity Ascending
                  </MenuItem>
                  <MenuItem value="orderBySoldAsc_false">
                    Order By Product Sold Quantity Descending
                  </MenuItem>
                  <MenuItem value="orderByNameAsc_true">
                    Order By Product Name Ascending
                  </MenuItem>
                  <MenuItem value="orderByNameAsc_false">
                    Order By Product Name Descending
                  </MenuItem>
                </Select>
              </FormControl>
              <div className="mainSearchControl">
                <Box className="priceRangeContainer">
                  <Typography variant="h6">
                    Showing products with price ranging from ${priceRange[0]} to
                    ${priceRange[1]}
                  </Typography>
                  <Slider
                    getAriaLabel={() => "Price range"}
                    value={priceRange}
                    onChange={(e, newVal) => setPriceRange(() => newVal)}
                    getAriaValueText={() => "$USD"}
                    min={0}
                    valueLabelDisplay="auto"
                    step={100}
                    max={5000}
                  />
                </Box>
                <Box className="SoldRangeContainer">
                  <Typography variant="h6">
                    Showing products with items sold from {soldRange[0]} to{" "}
                    {soldRange[1]}
                  </Typography>
                  <Slider
                    getAriaLabel={() => "Sold range"}
                    value={soldRange}
                    onChange={(e, newVal) => setSoldRange(() => newVal)}
                    getAriaValueText={() => "items"}
                    min={0}
                    valueLabelDisplay="auto"
                    step={100}
                    max={100000}
                  />
                </Box>
                <div className="buttons">
                  <Button
                    onClick={() => {
                      setIsOriginalList(() => true);
                      loadProducts(
                        setProducts,
                        setDialogueLoading,
                        0,
                        rowsPerPage,
                        setPagingInfo
                      );
                      setPage(() => 0);
                      setIsOpeningModal(() => false);
                    }}
                    variant="outlined"
                  >
                    Reset filters
                  </Button>
                  <Button
                    onClick={() => {
                      reloadProductsWithOpts(
                        setProducts,
                        setDialogueLoading,
                        page,
                        rowsPerPage,
                        selectedDerpartment
                          ? selectedDerpartment.departmentId
                          : null,
                        selectedCategory ? selectedCategory.categoryId : null,
                        priceRange,
                        productStatus,
                        soldRange,
                        sortOpt,
                        selectedProductSearch
                          ? selectedProductSearch.productName
                          : null,
                        setPagingInfo
                      );
                      setPage(() => 0);
                      setSelectedCategory(() => null);
                      setSelectedDepartment(() => null);
                      setSelectedProductSearch(() => null);
                      setIsOriginalList(() => false);
                      setIsOpeningModal(() => false);
                    }}
                    variant="contained"
                  >
                    Apply filters
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
          <div className="orders">
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar
                  handleOpenModal={() => setIsOpeningModal(() => true)}
                  handleCreateProduct={() => setIsCreatingProduct(() => true)}
                />
                {pagingInfo && (
                  <>
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 10 }}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                      >
                        <EnhancedTableHead
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          rowCount={pagingInfo.totalRecords}
                        />
                        <TableBody>
                          {visibleRows &&
                            products &&
                            visibleRows.map((row, index) => {
                              // const isItemSelected = isSelected(row.orderId);
                              // const labelId = `enhanced-table-checkbox-${index}`;

                              return (
                                <TableRow
                                  hover
                                  onClick={(event) =>
                                    handleClick(event, row.productCardId)
                                  }
                                  role="checkbox"
                                  // aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={row.productCardId}
                                  // selected={isItemSelected}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {/* <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                      "aria-labelledby": labelId,
                                    }}
                                  />
                                </TableCell> */}
                                  <TableCell align="right">
                                    {row.productCardId}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.productName}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.categoryId}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.categoryName}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.departmentId}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.departmentName}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.productPrice}
                                  </TableCell>
                                  {/* <TableCell align="left">
                                    {row.productStatus}
                                  </TableCell> */}
                                  <TableCell align="right">
                                    {row.productSoldQuantity}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.productStatus
                                      ? "Available"
                                      : "Unavailable"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          {rowsPerPage - products.length > 0 && (
                            <TableRow
                              style={{
                                height:
                                  (dense ? 33 : 53) *
                                  (rowsPerPage - products.length),
                              }}
                            >
                              <TableCell colSpan={8} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={pagingInfo.totalRecords}
                      showFirstButton
                      showLastButton
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                )}
              </Paper>
              <FormControlLabel
                control={
                  <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
              />
            </Box>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default AdminProducts;
