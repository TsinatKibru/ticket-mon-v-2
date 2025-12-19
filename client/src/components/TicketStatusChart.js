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
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const generateChartData = () => {
      const statusCounts = {};

      tickets.forEach((ticket) => {
        statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1;
      });

      const labels = Object.keys(statusCounts);
      const data = {
        labels,
        datasets: [
          {
            label: "Ticket Status",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(124, 58, 237, 0.7)", // Primary/Purple
              "rgba(54, 162, 235, 0.7)", // Blue
              "rgba(255, 99, 132, 0.7)", // Red
              "rgba(75, 192, 192, 0.7)", // Green
            ],
            borderColor: [
              "rgba(124, 58, 237, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };

      setChartData(data);
    };

    if (tickets) {
      generateChartData();
    }
  }, [tickets]);

  const isDark = theme === 'business';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: textColor, font: { family: 'Outfit', size: 10 } },
        grid: { color: gridColor, drawBorder: false }
      },
      x: {
        ticks: { color: textColor, font: { family: 'Outfit', size: 10 } },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#1a1c23' : '#fff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false
      }
    },
  };

  return (
    <div className="w-full h-full min-h-[250px]">
      {chartData ? (
        <Bar options={options} data={chartData} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-md opacity-20"></span>
        </div>
      )}
    </div>
  );
}

export default TicketStatusChart;
