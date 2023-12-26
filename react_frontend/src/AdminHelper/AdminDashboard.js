import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import AdminSideBar from "./AdminSidebar";
import Box from "@mui/material/Box";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { LinePlot } from "@mui/x-charts/LineChart";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { url } from "../utils";

const loadMonthlyTotal = async (setMonthlyTotal) => {
  await fetch(url + "/api/Stat/MonthlyTotal")
    .then((e) => e.ok && e.json())
    .then((e) => setMonthlyTotal(() => e));
};
const loadMonthlyOrder = async (setMonthlyTotal) => {
  await fetch(url + "/api/Stat/CountMonthly")
    .then((e) => e.ok && e.json())
    .then((e) => setMonthlyTotal(() => e));
};

const AdminDashboard = () => {
  const { isLoading, setPageLoaded } = useLoadingContext();
  const [monthlyTotal, setMonthlyTotal] = useState([]);
  const [monthlyOrder, setMonthlyOrder] = useState([]);
  useEffect(() => {
    loadMonthlyTotal(setMonthlyTotal);
    loadMonthlyOrder(setMonthlyOrder);
    setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    monthlyOrder &&
    monthlyTotal && (
      <div>
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <ResponsiveChartContainer
            xAxis={[
              {
                scaleType: "band",
                data: monthlyOrder.map((x) => x.month),
                id: "month",
                label: "Month",
              },
            ]}
            yAxis={[{ id: "Number_of_Orders" }, { id: "Monthly_Total" }]}
            series={
              [
                {
                  type: "line",
                  id: "monthlyCount",
                  yAxisKey: "Number_of_Orders",
                  data: monthlyOrder.map((x) => x.Number_of_Orders),
                },
                {
                  type: "bar",
                  id: "monthlyTotal",
                  yAxisKey: "Monthly_Total",
                  data: monthlyTotal.map((x) => x.Monthly_Total),
                },
              ]
              // {
              //   type: "line",
              //   id: "revenue",
              //   yAxisKey: "money",
              //   data: [5645, 7542, 9135, 12221],
              // },
              // {
              //   type: "bar",
              //   id: "cookies",
              //   yAxisKey: "quantities",
              //   data: [3205, 2542, 3135, 8374],
              // },
              // {
              //   type: "bar",
              //   id: "icecream",
              //   yAxisKey: "quantities",
              //   data: [1645, 5542, 5146, 3735],
              // },
            }
            height={400}
            margin={{ left: 70, right: 70 }}
            sx={{
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translate(-25px, 0)",
              },
              [`.${axisClasses.right} .${axisClasses.label}`]: {
                transform: "translate(30px, 0)",
              },
            }}
          >
            <BarPlot />
            <LinePlot />
            <ChartsXAxis
              axisId="quarters"
              label="2021 quarters"
              labelFontSize={18}
            />
            <ChartsYAxis axisId="quantities" label="# units sold" />
            <ChartsYAxis axisId="money" position="right" label="revenue" />
          </ResponsiveChartContainer>
        </Box>
      </div>
    )
  );
};

export default AdminDashboard;
