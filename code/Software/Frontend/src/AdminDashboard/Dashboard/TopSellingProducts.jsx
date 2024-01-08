import React from 'react'
import { useState, useEffect } from 'react';
//import './Dashboard.css'
import './TopSellingProduct.css'


function TopSellingProducts() {
    const [topSellingProducts, settopSellingProducts] = useState([]);

  useEffect(() => {
    // Fetch top products data and set it to the state
    // You can make an API call or use any other method to get the data
    const fetchData = async () => {
      // Example data
      const topProductsData = [
        { id: 1, name: 'Apple', image: 'https://healthjade.com/wp-content/uploads/2017/10/apple-fruit.jpg', popularity: '88%', sales: 345 },
        { id: 2, name: 'Chocolate Biscuit', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/600-600/114800--01--1623926473.jpeg', popularity: '61%', sales: 280 },
        { id: 3, name: 'Organic Milk Box', image: 'https://horizon.com/wp-content/uploads/horizon-organic-whole-dha-omega-3-milk.png', popularity: '52%', sales: 220 },
        ];

      settopSellingProducts(topProductsData);
    };

    fetchData();
  }, []);
    return (
        <div >
<h2>Top Selling Products</h2>
<p>View and Manage your top selling products</p>
<br />
<div className="container_for_topselling bg-white">
  <div className="row row-1 row-3-md-2 g-4" style={{flexWrap: 'nowrap', gap: '1px'}}>
  {topSellingProducts.map((product) => (
            <div key={product.id} className="col">
              <div className="card square-card_topselling">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body_topselling">
                  <p className="card-text">{product.name}</p>
                  <p className="card-text">Sold count: {product.sales}</p>
                </div>
              </div>
            </div>
          ))}
  </div>
</div>
</div>
    )
}
export default TopSellingProducts