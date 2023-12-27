import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import { url } from "../utils";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
import "../stylesheets/adminCustomer.css";
import CustomerEditModal from "./CustomerEditModal";

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
    id: "customerId",
    numeric: true,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "customerEmail",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "customerFname",
    numeric: false,
    disablePadding: false,
    label: "F.Name",
  },
  {
    id: "customerLname",
    numeric: false,
    disablePadding: false,
    label: "L.Name",
  },
  {
    id: "customerSegment",
    numeric: false,
    disablePadding: false,
    label: "Segment",
  },
  {
    id: "customerCity",
    numeric: false,
    disablePadding: false,
    label: "City",
  },
  {
    id: "customerState",
    numeric: false,
    disablePadding: false,
    label: "State",
  },
  {
    id: "customerStreet",
    numeric: false,
    disablePadding: false,
    label: "Street",
  },
  {
    id: "customerZipcode",
    numeric: false,
    disablePadding: false,
    label: "Zipcode",
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
const reloadCustomersWithOpt = async (
  setCustomers,
  setDialogueLoading,
  page,
  rowsPerPage,
  idSearch,
  email,
  fname,
  lname,
  segment,
  city,
  state,
  street,
  zipcode,
  sortOpt,
  setPagingInfo
) => {
  try {
    const accountToken = localStorage.getItem("accountToken");
    if (!accountToken || accountToken.length < 10)
      throw new Error("Token not found or expired please login again");
    setDialogueLoading(true, "Applying your search...");
    let queryUrl = new URL(url + "/api/Customer");
    queryUrl.searchParams.append("PageSize", rowsPerPage);
    queryUrl.searchParams.append("PageNumber", page);
    if (idSearch && idSearch > 0)
      queryUrl.searchParams.append("CustomerId", idSearch);
    if (fname) queryUrl.searchParams.append("CustomerFname", fname);
    if (lname) queryUrl.searchParams.append("CustomerLname", lname);
    if (segment) queryUrl.searchParams.append("CustomerSegment", segment);
    if (city) queryUrl.searchParams.append("CustomerCity", city);
    if (state) queryUrl.searchParams.append("CustomerState", state);
    if (street) queryUrl.searchParams.append("CustomerStreet", street);
    if (zipcode) queryUrl.searchParams.append("CustomerZipcode", zipcode);
    if (email) queryUrl.searchParams.append("CustomerEmail", email);
    if (sortOpt)
      queryUrl.searchParams.append(
        sortOpt.split("_")[0],
        sortOpt.split("_")[1]
      );
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
        setCustomers(() => e.data);
        setDialogueLoading(false);
        if (setPagingInfo) setPagingInfo(() => e);
      });
  } catch (e) {
    alert(e);
    setDialogueLoading(false, "Applying your search...");
  }
};

const loadAdminCustomers = async (
  setCustomers,
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
    url + "/api/Customer?pageNumber=" + pageNumber + "&pageSize=" + pageSize,
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
      setCustomers(() => e.data);
      setDialogueLoading(false);
      setPagingInfo && setPagingInfo(() => e);
      if (setPageLoaded) setPageLoaded(true);
    })
    .catch((e) => alert(e));
};
const AdminCustomer = () => {
  const { setPageLoaded, setDialogueLoading, isLoading } = useLoadingContext();
  const [customers, setCustomers] = useState([]);
  const [pagingInfo, setPagingInfo] = useState();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [sortOpt, setSortOpt] = useState("sortByOrderDateDescending");
  const [searchId, setSearchId] = useState(0);
  const [city, setCity] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [state, setState] = useState("");
  const [segment, setSegment] = useState("Consumer");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState(0);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  // const [shippingMode, setShippingMode] = useState("Standard Class");
  // const [deliveryStatus, setDeliveryStatus] = useState("Shipping on time");
  const [orderBy, setOrderBy] = React.useState("orderId");
  // const [dateRange, setDateRange] = useState({
  //   start: dayjs("01/01/2018"),
  //   end: dayjs(),
  // });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isOriginalList, setIsOriginalList] = useState(true);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [viewingCustomerId, setViewingCustomerId] = useState(5654);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  useEffect(() => {
    loadAdminCustomers(
      setCustomers,
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
      const newSelected = customers.map((n) => n.orderId);
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
    setViewingCustomerId(() => id);
    setIsEditingCustomer(() => true);
  };
  const handleChangePage = (event, newPage) => {
    if (isOriginalList)
      loadAdminCustomers(
        setCustomers,
        setDialogueLoading,
        newPage,
        rowsPerPage
      );
    else {
      reloadCustomersWithOpt(
        setCustomers,
        setDialogueLoading,
        newPage,
        rowsPerPage,
        searchId,
        email,
        fname,
        lname,
        segment,
        city,
        state,
        street,
        zipcode,
        sortOpt,
        setPagingInfo
      );
    }
    setPage(() => newPage);
  };
  useEffect(
    () =>
      setVisibleRows(() =>
        stableSort(customers, getComparator(order, orderBy))
      ),
    [customers, order, orderBy, page, rowsPerPage]
  );
  const handleChangeRowsPerPage = (event) => {
    const newRow = event.target.value;
    if (isOriginalList)
      loadAdminCustomers(setCustomers, setDialogueLoading, page, newRow);
    else {
      reloadCustomersWithOpt(
        setCustomers,
        setDialogueLoading,
        page,
        newRow,
        searchId,
        email,
        fname,
        lname,
        segment,
        city,
        state,
        street,
        zipcode,
        sortOpt,
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
    <div className={`adminCustomerMain ${isLoading ? "dimmed" : ""}`}>
      <CustomerEditModal
        customerId={viewingCustomerId}
        isEditingCustomer={isEditingCustomer}
        setIsEditingCustomer={setIsEditingCustomer}
      />
      <Modal
        open={isOpeningModal}
        onClose={() => setIsOpeningModal(() => false)}
      >
        <div>
          <Box className="adminCustomerFilterOptions">
            <Typography variant="h5">Filter options for customers</Typography>
            <TextField
              className="searchCustomerId"
              label="Search By CustomerID"
              value={searchId}
              type="number"
              onChange={(e) => setSearchId(() => e.target.value)}
            />
            <TextField
              className="searchCustomerEmail"
              label="Search By Customer Email"
              value={email}
              onChange={(e) => setEmail(() => e.target.value)}
            />
            <TextField
              className="searchCustomerFname"
              label="Search By Customer First Name"
              value={fname}
              onChange={(e) => setFname(() => e.target.value)}
            />
            <TextField
              className="searchCustomerLname"
              label="Search By Customer Last Name"
              value={lname}
              onChange={(e) => setLname(() => e.target.value)}
            />
            <FormControl className="customerSegmentContainer">
              <InputLabel>Customer Segment</InputLabel>
              <Select
                value={segment}
                onChange={(e) => setSegment(() => e.target.value)}
                className="customerSegment"
                label={"Customer segment"}
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
              label="Search By Customer State"
              value={state}
              onChange={(e) => setState(() => e.target.value)}
            />
            <TextField
              className="searchCustomerStreet"
              label="Search By Customer Street"
              value={street}
              onChange={(e) => setStreet(() => e.target.value)}
            />
            <TextField
              className="searchCustomerZipcode"
              label="Search By Customer Zipcode"
              value={zipcode}
              type="number"
              onChange={(e) => setZipcode(() => e.target.value)}
            />
            <TextField
              className="searchCustomerCity"
              label="Search By Customer City"
              value={city}
              type="number"
              onChange={(e) => setCity(() => e.target.value)}
            />
            <FormControl className="adminCustomerSortOptionsContainer">
              <InputLabel>Sort results by</InputLabel>
              <Select
                value={sortOpt}
                onChange={(e) => setSortOpt(() => e.target.value)}
                className="adminCustomerSortOptions"
                label={"Sort results by"}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="orderByIdAsc_true">
                  Order by ID ascending
                </MenuItem>
                <MenuItem value="orderByIdAsc_false">
                  Order by ID ascending
                </MenuItem>
                <MenuItem value="orderByCountryAsc_true">
                  Order by Country Name ascending
                </MenuItem>
                <MenuItem value="orderByCountryAsc_false">
                  Order by Country Name descending
                </MenuItem>
                <MenuItem value="orderByCityAsc_true">
                  Order by City Name ascending
                </MenuItem>
                <MenuItem value="orderByCityAsc_false">
                  Order by City Name descending
                </MenuItem>
                <MenuItem value="orderByFnameAsc_true">
                  Order by First Name ascending
                </MenuItem>
                <MenuItem value="orderByFnameAsc_false">
                  Order by First Name descending
                </MenuItem>
                <MenuItem value="orderByLnameAsc_true">
                  Order by Last Name ascending
                </MenuItem>
                <MenuItem value="orderByLnameAsc_false">
                  Order by Last Name descending
                </MenuItem>
                <MenuItem value="orderByStateAsc_true">
                  Order by State ascending
                </MenuItem>
                <MenuItem value="orderByStateAsc_false">
                  Order by State descending
                </MenuItem>
                <MenuItem value="orderByStreetAsc_true">
                  Order by Street ascending
                </MenuItem>
                <MenuItem value="orderbyStreetAsc_false">
                  Order by Street descending
                </MenuItem>
                <MenuItem value="orderByZipcodeAsc_true">
                  Order by Zipcode ascending
                </MenuItem>
                <MenuItem value="orderByZipcodeAsc_false">
                  Order by Zipcode descending
                </MenuItem>
              </Select>
            </FormControl>
            <div className="controls">
              <Button
                variant="outlined"
                onClick={() => {
                  setIsOriginalList(() => true);
                  loadAdminCustomers(
                    setCustomers,
                    setDialogueLoading,
                    page,
                    rowsPerPage,
                    setPagingInfo
                  );
                  setSelected(() => []);
                  setPage(() => 0);
                  setIsOpeningModal(() => false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  reloadCustomersWithOpt(
                    setCustomers,
                    setDialogueLoading,
                    page,
                    rowsPerPage,
                    searchId,
                    email,
                    fname,
                    lname,
                    segment,
                    city,
                    state,
                    street,
                    zipcode,
                    sortOpt,
                    setPagingInfo
                  );
                  setSelected(() => []);
                  setPage(() => 0);
                  setIsOriginalList(() => false);
                  setIsOpeningModal(() => false);
                }}
              >
                Apply filter
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h3" className="adminCustomerTitle">
          Customer management
        </Typography>
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
                      customers &&
                      visibleRows.map((row, index) => {
                        // const isItemSelected = isSelected(row.orderId);
                        // const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) =>
                              handleClick(event, row.customerId)
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
                              {row.customerId}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerEmail}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerFname}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerLname}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerSegment}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerCity}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerState}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerStreet}
                            </TableCell>
                            <TableCell align="left">
                              {row.customerZipcode}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {rowsPerPage - customers.length > 0 && (
                      <TableRow
                        style={{
                          height:
                            (dense ? 33 : 53) *
                            (rowsPerPage - customers.length),
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
  );
};

export default AdminCustomer;
