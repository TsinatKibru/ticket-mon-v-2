import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "./TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TicketStatusChart({ tickets }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generateChartData = () => {
      const statusCounts = {};

      // Count tickets by status

      tickets.forEach((ticket) => {
        statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1;
      });

      // Prepare data for the chart
      const labels = Object.keys(statusCounts);
      const data = {
        labels,
        datasets: [
          {
            label: "Ticket Status",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)", // Red
              "rgba(54, 162, 235, 0.8)", // Blue
              "rgba(255, 206, 86, 0.8)", // Yellow
              "rgba(75, 192, 192, 0.8)", // Green
              "rgba(153, 102, 255, 0.8)", // Purple
              "rgba(255, 159, 64, 0.8)", // Orange
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      setChartData(data);
    };

    if (tickets) {
      generateChartData();
    }
  }, [tickets]);

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        text: "Ticket Status Distribution",
        color: '#fff'
      },
    },
  };

  return (
    <TitleCard title="Ticket Status">
      {chartData ? (
        <Bar options={options} data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </TitleCard>
  );
}

export default TicketStatusChart;
