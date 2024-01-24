import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


const Sales = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const chartRef = useRef(null);
  const fetchURL = "https://4e9eq7iw62.execute-api.ap-southeast-1.amazonaws.com/v1/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const lastTenDays = Array.from({ length: 30 }, (_, i) => {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          return day.toISOString().split('T')[0];
        });

        const fetchDataPromises = lastTenDays.map(async (day) => {
          const response = await axios.get( fetchURL+`bill/billCountPerDay/${day}`);
          return response.data.billCountSelectedDay;
          
        });

        const fetchedData = await Promise.all(fetchDataPromises);

        setData(fetchedData.reverse());
        setLabels(lastTenDays.reverse());
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const renderChart = () => {
      if (chartRef.current) {
        const chartInstance = chartRef.current.chartInstance;
        if (chartInstance) {
          chartInstance.destroy();
        }

        chartRef.current.chartInstance = new Chart(chartRef.current.getContext('2d'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Bill Issued Per Day (customer count)',
                data: data,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'category',
                labels: labels,
              },
              y: {
                beginAtZero: true,
                min: 0,
              },
            },
          },
        });
      }
    };

    renderChart();
  }, [data, labels]);

  return (
    <div>
      <h2>Sales Data Variation</h2><br/>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Sales;

