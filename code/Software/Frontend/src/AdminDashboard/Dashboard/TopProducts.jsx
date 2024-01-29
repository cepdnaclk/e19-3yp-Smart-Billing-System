import React, { useEffect, useState } from 'react';
import './TopProducts.css';

const TopProducts = () => {
  const fetchURL = "https://smart-billing-system-50913e9a24e6.herokuapp.com/";
  const [products, setProducts] = useState([]);
  
  const [totalProductSold, setTotalProductSold] = useState(0);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(fetchURL+'itemPurchased/topProducts');
        //const response = await fetch('http://localhost:5555/itemPurchased/topProducts');
        const data = await response.json(); // Parse JSON content
        console.log(data);
        const updatedProducts = await Promise.all(
          data.topProducts.map(async (product) => {

            if (product.productID[0]=='%'){
              product.productID = product.productID.slice(3, -3);
            }
            const productDetailsResponse = await fetch(fetchURL +`/product/${product.productID}`);
            //const productDetailsResponse = await fetch(`http://localhost:5555/product/${product.productID}`);
            const productDetailsData = await productDetailsResponse.json();

            return {
              ...product,
              name: productDetailsData.productName,
              image: productDetailsData.imgURL,
            };
          })
        );

        setProducts(updatedProducts);

      const totalProductSoldResponse = await fetch(fetchURL+'itemPurchased/quantity/t');
      //const totalProductSoldResponse = await fetch('http://localhost:5555/itemPurchased/quantity/t');
      const totalProductSoldData = await totalProductSoldResponse.json();
      
      setTotalProductSold(totalProductSoldData.totalcountToday);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (   
    <div className="top-products-container">
      <h3>Top Products</h3>
      <div className="container_for_sales bg-white">
        <table style={{ border: '2px solid green' }}>
          <thead>
            <tr style={{border:' 2px solid green'}}>
            <th style={{ color: 'green' ,background: 'lightgreen'}}>Rank</th>
            <th style={{ color: 'green' ,background: 'lightgreen'}}>Product Name</th>
            <th style={{ color: 'green' ,background: 'lightgreen'}}>Image</th>
            <th style={{ color: 'green' ,background: 'lightgreen'}}>Popularity</th>
            <th style={{ color: 'green' ,background: 'lightgreen'}}>Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.productID} style={{ border: '1px solid green' }}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>
                  <img src={product.image} alt={product.name} style={{ width: '100px', height: 'auto' }} />
                </td>
                
                <td>{(product.quantity / totalProductSold * 100).toFixed(0)}%</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;
