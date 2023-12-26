import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import { url } from "../utils";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import Slider from "@mui/material/Slider";
import { Button, InputLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
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
import OrderEditModal from "./OrderEditModal";

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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
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
        Orders
      </Typography>
      {/* )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : ( */}
      <Tooltip title="Filter list">
        <IconButton onClick={handleOpenModal}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      {/* )} */}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const headCells = [
  {
    id: "orderId",
    numeric: true,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Payment",
  },
  {
    id: "customerFname",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "customerEmail",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "Total($)",
  },
  {
    id: "orderStatus",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "orderDate",
    numeric: false,
    disablePadding: false,
    label: "OrderDate",
  },
  {
    id: "shippingDate",
    numeric: false,
    disablePadding: false,
    label: "ShippingDate",
  },
  {
    id: "shippingMode",
    numeric: false,
    disablePadding: false,
    label: "Shipping Mode",
  },
  {
    id: "deliveryStatus",
    numeric: false,
    disablePadding: false,
    label: "Delivery Status",
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
const reloadOrdersWithOpts = async (
  setOrders,
  setDialogueLoading,
  page,
  rowsPerPage,
  totalRange,
  customerSearch,
  emailSearch,
  dateRange,
  paymentType,
  sortOpt,
  orderStatus,
  shippingMode,
  deliveryStatus,
  setPagingInfo
) => {
  try {
    const accountToken = localStorage.getItem("accountToken");
    if (!accountToken || accountToken.length < 10)
      throw new Error("Token not found or expired please login again");
    setDialogueLoading(true, "Applying your search...");
    let queryUrl = new URL(url + "/api/Order");
    queryUrl.searchParams.append(sortOpt, true);
    queryUrl.searchParams.append("PageSize", rowsPerPage);
    queryUrl.searchParams.append("PageNumber", page);
    if (customerSearch)
      queryUrl.searchParams.append("CustomerFullName", customerSearch);
    if (emailSearch) queryUrl.searchParams.append("CustomerEmail", emailSearch);
    if (paymentType) queryUrl.searchParams.append("Type", paymentType);
    if (orderStatus) queryUrl.searchParams.append("OrderStatus", orderStatus);
    if (deliveryStatus)
      queryUrl.searchParams.append("DeliveryStatus", deliveryStatus);
    if (shippingMode)
      queryUrl.searchParams.append("ShippingMode", shippingMode);
    if (totalRange) {
      queryUrl.searchParams.append("totalGtThan", totalRange[0]);
      queryUrl.searchParams.append("totalSmallerThan", totalRange[1]);
    }

    if (dateRange) {
      const startDateTS = dateRange.start.valueOf() / 1000;
      const endDateTS = dateRange.end.valueOf() / 1000;
      queryUrl.searchParams.append("OrderDateGreaterThan", startDateTS);
      if (startDateTS < endDateTS)
        queryUrl.searchParams.append("OrderDateSmallerThan", endDateTS);
    }
    console.log(queryUrl.href);
    await fetch(queryUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accountToken,
      },
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

const loadAdminOrders = async (
  setOrders,
  setDialogueLoading,
  pageNumber,
  pageSize,
  setPagingInfo = null,
  setPageLoaded = null
) => {
  pageNumber += 1;
  setDialogueLoading(true, "Changing page...");
  const accountToken = localStorage.getItem("accountToken");
  await fetch(
    url + "/api/Order?pageNumber=" + pageNumber + "&pageSize=" + pageSize,
    {
      headers: {
        Authorization: "Bearer " + accountToken,
        "Content-type": "application/json",
      },
    }
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

const AdminOrders = () => {
  const { setPageLoaded, setDialogueLoading, isLoading } = useLoadingContext();
  const [orders, setOrders] = useState([]);
  const [pagingInfo, setPagingInfo] = useState();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [sortOpt, setSortOpt] = useState("sortByOrderDateDescending");
  const [paymentType, setPaymentType] = useState("CASH");
  const [orderStatus, setOrderStatus] = useState("CLOSED");
  const [emailSearch, setEmailSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [totalRange, setTotalRange] = useState([300, 2000]);
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [shippingMode, setShippingMode] = useState("Standard Class");
  const [deliveryStatus, setDeliveryStatus] = useState("Shipping on time");
  const [orderBy, setOrderBy] = React.useState("orderId");
  const [dateRange, setDateRange] = useState({
    start: dayjs("01/01/2018"),
    end: dayjs(),
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isOriginalList, setIsOriginalList] = useState(true);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState(75933);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  useEffect(() => {
    loadAdminOrders(
      setOrders,
      setDialogueLoading,
      page,
      rowsPerPage,
      setPagingInfo,
      setPageLoaded
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.orderId);
      setSelected(() => newSelected);
      return;
    }
    setSelected(() => []);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setViewingOrderId(() => id);
    setIsEditingOrder(() => true);
  };
  const handleChangePage = (event, newPage) => {
    if (isOriginalList)
      loadAdminOrders(setOrders, setDialogueLoading, newPage, rowsPerPage);
    else {
      reloadOrdersWithOpts(
        setOrders,
        setDialogueLoading,
        newPage,
        rowsPerPage,
        totalRange,
        customerSearch,
        emailSearch,
        dateRange,
        paymentType,
        sortOpt,
        orderStatus,
        shippingMode,
        deliveryStatus,
        setPagingInfo
      );
    }
    setPage(() => newPage);
  };
  useEffect(
    () =>
      setVisibleRows(() => stableSort(orders, getComparator(order, orderBy))),
    [orders, order, orderBy, page, rowsPerPage]
  );
  const handleChangeRowsPerPage = (event) => {
    const newRow = event.target.value;
    if (isOriginalList)
      loadAdminOrders(setOrders, setDialogueLoading, page, newRow);
    else {
      reloadOrdersWithOpts(
        setOrders,
        setDialogueLoading,
        page,
        newRow,
        totalRange,
        customerSearch,
        emailSearch,
        dateRange,
        paymentType,
        sortOpt,
        orderStatus,
        shippingMode,
        deliveryStatus,
        setPagingInfo
      );
    }
    setRowsPerPage(() => newRow);
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // const isSelected = (id) => selected.indexOf(id) !== -1;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <OrderEditModal
        orderId={viewingOrderId}
        isEditingOrder={isEditingOrder}
        setIsEditingOrder={() => setIsEditingOrder(() => false)}
      />
      <div className={`adminOrdersMain ${isLoading ? "dimmed" : ""}`}>
        <Typography variant="h3" className="adminOrdersTitle">
          Orders management
        </Typography>
        <Modal
          open={isOpeningModal}
          onClose={() => setIsOpeningModal(() => false)}
        >
          <Box className="adminOrderSearch">
            <Typography variant="h5" className="title">
              Filter Options:
            </Typography>
            <DatePicker
              label="Starting date"
              value={dateRange.start}
              onChange={(e) => setDateRange(() => ({ ...dateRange, start: e }))}
            />
            <DatePicker
              label="Ending date"
              value={dateRange.end}
              onChange={(e) => setDateRange(() => ({ ...dateRange, end: e }))}
            />
            <FormControl className="selectOrderStatus">
              <InputLabel>Order status</InputLabel>
              <Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(() => e.target.value)}
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
            <FormControl className="sortOptionsContainer">
              <InputLabel>Sort options</InputLabel>
              <Select
                value={sortOpt}
                onChange={(e) => setSortOpt(() => e.target.value)}
                className="sortOptions"
                label={"Sort Options"}
              >
                <MenuItem value="sortByOrderDateDescending">
                  By Order Date Descending
                </MenuItem>
                <MenuItem value="sortByOrderDateAscending">
                  By Order Date Ascending
                </MenuItem>
                <MenuItem value="sortByTotalDescending">
                  By Order Total Descending
                </MenuItem>
                <MenuItem value="sortByTotalAscending">
                  By Order Total Ascending
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className="paymentTypeContainer">
              <InputLabel>Payment type</InputLabel>
              <Select
                value={paymentType}
                onChange={(e) => setPaymentType(() => e.target.value)}
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
                value={shippingMode}
                onChange={(e) => setShippingMode(() => e.target.value)}
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
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(() => e.target.value)}
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
            <TextField
              className="searchCustomerName"
              id="outlined-required"
              label="Search By Customer Name"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(() => e.target.value)}
            />
            <TextField
              className="searchCustomerEmail"
              id="outlined-required"
              label="Search By Customer Email"
              value={emailSearch}
              onChange={(e) => setEmailSearch(() => e.target.value)}
            />
            <div className="mainSearchControl">
              <Box className="priceRangeContainer">
                <Typography variant="h6">
                  Showing orders with total ranging from ${totalRange[0]} to $
                  {totalRange[1]}
                </Typography>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={totalRange}
                  onChange={(e, newVal) => setTotalRange(() => newVal)}
                  getAriaValueText={() => "$USD"}
                  min={0}
                  valueLabelDisplay="auto"
                  step={100}
                  max={5000}
                />
              </Box>
              <div className="buttons">
                <Button
                  onClick={() => {
                    setIsOriginalList(() => true);
                    loadAdminOrders(
                      setOrders,
                      setDialogueLoading,
                      0,
                      rowsPerPage,
                      setPagingInfo
                    );
                    setSelected(() => []);
                    setPage(() => 0);
                    setIsOpeningModal(() => false);
                  }}
                  variant="outlined"
                >
                  Reset filters
                </Button>
                <Button
                  onClick={() => {
                    reloadOrdersWithOpts(
                      setOrders,
                      setDialogueLoading,
                      page,
                      rowsPerPage,
                      totalRange,
                      customerSearch,
                      emailSearch,
                      dateRange,
                      paymentType,
                      sortOpt,
                      orderStatus,
                      shippingMode,
                      deliveryStatus,
                      setPagingInfo
                    );
                    setSelected(() => []);
                    setPage(() => 0);
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
                numSelected={selected.length}
                handleOpenModal={() => setIsOpeningModal(() => true)}
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
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={pagingInfo.totalRecords}
                      />
                      <TableBody>
                        {visibleRows &&
                          orders &&
                          visibleRows.map((row, index) => {
                            // const isItemSelected = isSelected(row.orderId);
                            // const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                onClick={(event) =>
                                  handleClick(event, row.orderId)
                                }
                                role="checkbox"
                                // aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.orderId}
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
                                  {row.orderId}
                                </TableCell>
                                <TableCell align="left">{row.type}</TableCell>
                                <TableCell align="left">
                                  {row.customerFullName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.customerEmail}
                                </TableCell>
                                <TableCell align="right">{row.total}</TableCell>
                                <TableCell align="left">
                                  {row.orderStatus}
                                </TableCell>
                                <TableCell align="left">
                                  {row.orderDate.split("T")[0]}
                                </TableCell>
                                <TableCell align="left">
                                  {row.shippingDate.split("T")[0]}
                                </TableCell>
                                <TableCell align="left">
                                  {row.shippingMode.split("T")[0]}
                                </TableCell>
                                <TableCell align="left">
                                  {row.deliveryStatus.split("T")[0]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {rowsPerPage - orders.length > 0 && (
                          <TableRow
                            style={{
                              height:
                                (dense ? 33 : 53) *
                                (rowsPerPage - orders.length),
                            }}
                          >
                            <TableCell colSpan={7} />
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
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          </Box>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AdminOrders;
