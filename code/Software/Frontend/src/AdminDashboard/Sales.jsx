import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Productsold from './Productsold';


const Sales = () => {
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
          //const response = await axios.get(`http://localhost:5555/bill/billCountPerDay/${day}`);
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
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Customer Variation',
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
                  borderRadius: 20, // Adjust the border radius of the bars if needed
                },
              },
              backgroundColor: 'lightblue', // Change the background color here
            },
          },
        });
      }
    };

    renderChart();
  }, [data, labels]);

  return (
    <div>
      <h2>CUSTOMER VARIATION</h2><br/>
      <canvas ref={chartRef}></canvas><br/><br/><br/>
      <Productsold/>
    </div>
  );
};

export default Sales;

