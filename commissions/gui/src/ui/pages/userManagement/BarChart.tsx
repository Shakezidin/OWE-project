import React from "react";
import { Bar } from "react-chartjs-2";
import "../userManagement/user.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);
const BarChart: React.FC = () => {
  const data = {
    labels: [
      "Admin Users",
      "Sales Manager",
      "Sales Representative",
      "Dealer",
      "Regional Manager",
      "Partner",
      "App Setter",
    ],
    datasets: [
      {
        label: "Onboarding",
        backgroundColor: "#2554A8",
        color: "red",
        borderTopLeftRadius: "",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [89, 38, 32, 45, 60, 40, 35],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  return (
    <>
      <div className="BarChart-Container">
        <h2>Onboarding Detail</h2>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default BarChart;
