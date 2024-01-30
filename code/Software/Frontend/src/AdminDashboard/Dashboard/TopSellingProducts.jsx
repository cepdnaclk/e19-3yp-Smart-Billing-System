import React from 'react'
import { useState, useEffect } from 'react';
//import './Dashboard.css'
import './TopSellingProduct.css'


function TopSellingProducts() {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const fetchURL = "https://smart-billing-system-50913e9a24e6.herokuapp.com/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchURL+'itemPurchased/topselling');
        //const response = await fetch('http://localhost:5555/itemPurchased/topselling');
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
<h2>TOP SELLING PRODUCTS</h2>
<p>View and Manage your top selling products</p>
<br />
<div className="container_for_topselling bg-white">
  <div className="row row-1 row-3-md-2 g-4" style={{flexWrap: 'nowrap', gap: '1px'}}>
  {topSellingProducts.map((product) => (
            <div key={product.productID} className="col">
              <div className="card square-card_topselling" style={{border:'green'}}>
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body_topselling">
                  <b><p className="card-text text-green">{product.name}</p>
                  <p className="card-text text-green">Sold count: {product.quantity}</p></b>
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