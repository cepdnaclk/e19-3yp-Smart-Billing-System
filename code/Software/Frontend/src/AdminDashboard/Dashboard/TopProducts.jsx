import React, { useEffect, useState } from 'react';
//import './TopProducts.css';

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5555/itemPurchased/topProducts");
        const data = await response.json(); // Parse JSON content
        console.log(data);
        const updatedProducts = await Promise.all(
          data.topSellingProducts.map(async (product) => {

            if (product.productID[0]=='%'){
              product.productID = product.productID.slice(3, -3);
            }
            ///const productDetailsResponse = await fetch(fetchURL +`/product/${product.productID}`);
            const productDetailsResponse = await fetch(`http://localhost:5555/product/${product.productID}`);
            //const productDetailsResponse = await fetch("http://localhost:5555/product/6591a6e000919e2a51ca9be9");
            const productDetailsData = await productDetailsResponse.json();

            return {
              ...product,
              name: productDetailsData.productName,
              image: productDetailsData.imgURL,
            };
          })
        );

        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (   
    <div >
      <h3>Top Products</h3>
        <br />
        <div className="container_for_sales bg-white">
            <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product Name</th>
              <th>Image</th>
              <th>Popularity</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.productID}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td><img src={product.image} alt={product.name} style={{ width: '100px', height: 'auto' }} /></td>
                <td>{product.popularity}</td>
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
