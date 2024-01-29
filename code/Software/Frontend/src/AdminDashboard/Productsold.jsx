import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


const Productsold = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const chartRef = useRef(null);
  const fetchURL = "https://smart-billing-system-50913e9a24e6.herokuapp.com/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const lastTenDays = Array.from({ length: 30 }, (_, i) => {
          const day = new Date(today);
          day.setDate(today.getDate() - i+1);
          return day.toISOString().split('T')[0];
        });

        const fetchDataPromises = lastTenDays.map(async (day) => {
          const response = await axios.get( fetchURL+`bill/billCountPerDay/${day}`);
          //const response = await axios.get(`http://localhost:5555/itemPurchased/salesPerDay/${day}`);
          return response.data.totalSaleToday;
          
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
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Sales Per Day (LKR)',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change the color here
                borderColor: 'rgba(255, 99, 132, 1)', // Border color of the bars
                borderWidth: 1,
                
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
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Sales Variation',
              },
              layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                bar: {
                  borderRadius: 20,
                },
              },
              backgroundColor: 'lightblue', 
            },
          },
        });
      }
    };

    renderChart();
  }, [data, labels]);

  return (
    <div>
      <h2>SALES VARIATION</h2><br/>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Productsold;

