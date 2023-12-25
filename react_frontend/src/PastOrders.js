import React, { useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContext";
import AccountSidebar from "./AccountSidebar";
import { navigateToNewPage, url } from "./utils";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import Slider from "@mui/material/Slider";
import "./stylesheets/pastOrders.css";
import { Button, InputLabel } from "@mui/material";
import { getAllProducts } from "./Home";
import Order from "./Order";

const getPastOrders = async (setPastOrders, setPageLoaded) => {
  try {
    const accountToken = localStorage.getItem("accountToken");
    if (!accountToken || accountToken.length < 10)
      throw new Error("Token not found or expired please login again");
    await fetch(url + "/api/Order/Customer", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accountToken,
      },
    })
      .then((e) => {
        if (e.ok) return e.json();
      })
      .then((e) => {
        setPastOrders(() => e);
        setPageLoaded(true);
      });
  } catch (e) {
    alert(e);
    navigateToNewPage("/login");
  }
};
const reloadOrdersWithOpts = async (
  setOrders,
  setDialogueLoading,
  sortOpt,
  totalRange,
  dateRange,
  searchProduct
) => {
  try {
    const accountToken = localStorage.getItem("accountToken");
    if (!accountToken || accountToken.length < 10)
      throw new Error("Token not found or expired please login again");
    setDialogueLoading(true, "Applying your search...");
    let queryUrl = new URL(url + "/api/Order/Customer");
    queryUrl.searchParams.append(sortOpt, true);
    if (totalRange) {
      queryUrl.searchParams.append("totalGtThan", totalRange[0]);
      queryUrl.searchParams.append("totalSmallerThan", totalRange[1]);
    }
    if (searchProduct && typeof searchProduct.productName) {
      queryUrl.searchParams.append("ProductName", searchProduct.productName);
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
        setOrders(() => e);
        setDialogueLoading(false);
      });
  } catch (e) {
    alert(e);
    setDialogueLoading(false, "Applying your search...");
  }
};

const PastOrders = () => {
  const { isLoading, setDialogueLoading, setPageLoaded } = useLoadingContext();
  const [pastOrders, setPastOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOpt, setSortOpt] = useState("sortByOrderDateDescending");
  const [totalRange, setTotalRange] = useState([300, 2000]);
  const [dateRange, setDateRange] = useState({
    start: dayjs("01/01/2018"),
    end: dayjs(),
  });
  const [searchProduct, setSearchProduct] = useState({});
  //   string? ProductName, double? OrderDateGreaterThan,
  // double? OrderDateSmallerThan, double? totalGtThan,
  // double? totalSmallerThan, bool? sortByOrderDateAscending,
  // bool? sortByOrderDateDescending, bool? sortByTotalDescending,
  // bool? sortByTotalAscending
  useEffect(() => {
    getPastOrders(setPastOrders, setPageLoaded);
    getAllProducts(setProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className={`pastMain ${isLoading ? "dimmed" : ""}`}>
        <AccountSidebar />
        <h2 className="title">All orders</h2>
        <div className="orderSearch">
          <div className="mainSearchControl">
            <span>
              Show orders with total ranging from ${totalRange[0]} to $
              {totalRange[1]}
            </span>
            <Button
              onClick={() =>
                reloadOrdersWithOpts(
                  setPastOrders,
                  setDialogueLoading,
                  sortOpt,
                  totalRange,
                  dateRange,
                  searchProduct
                )
              }
              variant="contained"
            >
              Apply filters
            </Button>
          </div>
          <Box>
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
          {products && (
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.productName}
              onChange={(e, newVal) => setSearchProduct(() => newVal)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Orders containing product"
                  variant="standard"
                />
              )}
            />
          )}
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
          <FormControl>
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
        </div>
        <div className="orders">
          {pastOrders &&
            pastOrders.map((order, key) => <Order order={order} key={key} />)}
        </div>
      </main>
    </LocalizationProvider>
  );
};

export default PastOrders;
