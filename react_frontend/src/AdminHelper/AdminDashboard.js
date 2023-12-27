import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { url } from "../utils";
import { useLoadingContext } from "../LoadingContext";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import "../stylesheets/adminDashMain.css";
import Typography from "@mui/material/Typography";

const loadMonthlyTotal = async (setMonthlyTotal) => {
  await fetch(url + "/api/Stat/MonthlyTotal")
    .then((e) => e.ok && e.json())
    .then((e) => setMonthlyTotal(() => e));
};
const loadMonthlyOrder = async (setMonthlyTotal) => {
  await fetch(url + "/api/Stat/CountMonthly")
    .then((e) => e.ok && e.json())
    .then((e) => {
      setMonthlyTotal(() => e);
    });
};
const loadMonthlySummary = async (setMonthlySummary) => {
  await fetch(url + "/api/Stat/YearlySummary")
    .then((e) => e.ok && e.json())
    .then((e) => {
      setMonthlySummary(() => e);
    });
};

const AdminDashboard = () => {
  const { setPageLoaded } = useLoadingContext();
  const [monthlySummary, setMonthlySummary] = React.useState();
  const [monthlyTotal, setMonthlyTotal] = React.useState();
  const [monthlyOrder, setMonthlyOrder] = React.useState();
  React.useEffect(() => {
    loadMonthlySummary(setMonthlySummary);
    loadMonthlyTotal(setMonthlyTotal);
    loadMonthlyOrder(setMonthlyOrder);
    setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (monthlySummary&& monthlyTotal)
    return (
      <div className="adminDashMain">
        <div className="bar">
          <BarChart
            xAxis={[
              { scaleType: "band", data: monthlySummary.map((x) => x.year) },
            ]}
            series={[
              {
                data: monthlySummary.map((x) => x.canceled),
                label: "Canceled orders",
              },
              {
                data: monthlySummary.map((x) => x.closed),
                label: "Completed orders",
              },
              {
                data: monthlySummary.map((x) => x.oN_HOLD),
                label: "Orders on hold",
              },
              {
                data: monthlySummary.map((x) => x.pending),
                label: "Pending orders",
              },
            ]}
            width={1200}
            height={600}
          />
        </div>
        <div className="line">
          <LineChart
            xAxis={[{ data: monthlyTotal.map((x,index) => index), label: "month" }]}
            series={[
              {
                data: monthlyOrder.map((x) => x.number_of_Orders), label:"Order totals"
              },
            ]}
            width={1200}
            height={300}
          />
        </div>
        <div className="pie">
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: monthlySummary[0].pendinG_PAYMENT,
                    label: "Pending payment",
                  },
                  {
                    id: 1,
                    value: monthlySummary[0].suspecteD_FRAUD,
                    label: "Suspected Fraud",
                  },
                  {
                    id: 2,
                    value: monthlySummary[0].processing,
                    label: "Processing",
                  },
                ],
                innerRadius: 30,
                outerRadius: 200,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 180,
                cx: 260,
                cy: 300,
              },
            ]}
            width={500}
            height={500}
          />
          <div className="summary">
            <div className="first">
              <Typography variant="h6" color="initial">
                Pending payment
              </Typography>
              <Typography variant="caption" color="initial">
                {monthlySummary[0].pendinG_PAYMENT}
              </Typography>
            </div>
            <div className="2nd">
              <Typography variant="h6" color="initial">
                Suspected fraud
              </Typography>
              <Typography variant="caption" color="initial">
                {monthlySummary[0].suspecteD_FRAUD}
              </Typography>
            </div>
            <div className="3rd">
              <Typography variant="h6" color="initial">
                Processing
              </Typography>
              <Typography variant="caption" color="initial">
                {monthlySummary[0].processing}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  else return <></>;
};

export default AdminDashboard;
