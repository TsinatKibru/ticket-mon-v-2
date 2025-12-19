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
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MyTicketsChart({ tickets }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generateChartData = () => {
      const ticketCounts = {};

      // Count tickets created per day
      tickets.forEach((ticket) => {
        const createdAt = format(ticket.createdAt, "yyyy-MM-dd");
        //const createdAt = moment(ticket.createdAt).format("YYYY-MM-DD");
        ticketCounts[createdAt] = (ticketCounts[createdAt] || 0) + 1;
      });

      // Prepare data for the chart
      const labels = Object.keys(ticketCounts);
      const data = {
        labels,
        datasets: [
          {
            label: "Tickets Created",
            data: Object.values(ticketCounts),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgb(53, 162, 235)",
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
        text: "Tickets Activity",
        color: '#fff'
      },
    },
  };
  return (
    <TitleCard title=" Tickets" padding={"px-2 py-2 md:px-6 md:py-6"}>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </TitleCard>
  );
}

export default MyTicketsChart;
