import React from 'react'
import { useState, useEffect } from 'react';
//import './Dashboard.css'
import './TopSellingProduct.css'


function TopSellingProducts() {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const fetchURL = "https://4e9eq7iw62.execute-api.ap-southeast-1.amazonaws.com/v1/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchURL+'itemPurchased/topselling');
        const data = await response.json(); // Parse JSON content
        console.log(data);
        const updatedProducts = await Promise.all(
          data.topSellingProducts.map(async (product) => {

            if (product.productID[0]=='%'){
              product.productID = product.productID.slice(3, -3);
            }
            const productDetailsResponse = await fetch(fetchURL +`product/${product.productID}`);
            //const productDetailsResponse = await fetch(`http://localhost:5555/product/${product.productID}`);

            const productDetailsData = await productDetailsResponse.json();

            return {
              ...product,
              name: productDetailsData.productName,
              image: productDetailsData.imgURL,
            };
          })
        );

        setTopSellingProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
            <div key={product.productID} className="col">
              <div className="card square-card_topselling">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body_topselling">
                  <p className="card-text">{product.name}</p>
                  <p className="card-text">Sold count: {product.quantity}</p>
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