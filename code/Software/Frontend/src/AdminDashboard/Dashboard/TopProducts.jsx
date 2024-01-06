import React, { useEffect, useState } from 'react';
//import './TopProducts.css';

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch top products data and set it to the state
    // can make an API call or use any other method to get the data
    const fetchData = async () => {
      // Example data
      const topProductsData = [
        { id: 1, name: 'Apple', image: 'https://healthjade.com/wp-content/uploads/2017/10/apple-fruit.jpg', popularity: '88%', sales: 345 },
        { id: 2, name: 'Chocolate Biscuit', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/600-600/114800--01--1623926473.jpeg', popularity: '61%', sales: 280 },
        { id: 3, name: 'Organic Milk Box', image: 'https://horizon.com/wp-content/uploads/horizon-organic-whole-dha-omega-3-milk.png', popularity: '52%', sales: 220 },
        { id: 4, name: 'Chocolate Bar', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Green_and_Black%27s_dark_chocolate_bar_2.jpg/640px-Green_and_Black%27s_dark_chocolate_bar_2.jpg', popularity: '34%', sales: 180 },
      ];

      setProducts(topProductsData);
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
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td><img src={product.image} alt={product.name} style={{ width: '100px', height: 'auto' }} /></td>
                <td>{product.popularity}</td>
                <td>{product.sales}</td>
              </tr>
            ))}
          </tbody>
            </table>
         
        </div>
    </div>  
  );
};

export default TopProducts;
