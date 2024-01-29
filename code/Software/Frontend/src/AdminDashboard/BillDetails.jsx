// BillDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BillDetails.css';

function BillDetails() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const fetchURL = "https://smart-billing-system-50913e9a24e6.herokuapp.com/";

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await fetch(fetchURL+`/itemPurchased/bill/${id}`);
       // const response = await fetch(`http://localhost:5555/itemPurchased/bill/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch bill details. Status: ${response.status}`);
        }
        const billData = await response.json();
        
        
        // Fetch product details for each item in the bill
        const productDetailsPromises = billData.map(async (item) => {

            if (item.productID[0]=='%'){
                item.productID = item.productID.slice(3, -3);
               }
          //const productResponse = await fetch(`http://localhost:5555/product/${item.productID}`);
          const productResponse = await fetch(fetchURL+`/product/${item.productID}`);
          if (!productResponse.ok) {
            throw new Error(`Failed to fetch product details for product ID: ${item.productID}`);
          }
          const productData = await productResponse.json();
          
          return { ...item, productName: productData.productName };
        });
  
        // Resolve all promises
        const productDetails = await Promise.all(productDetailsPromises);
        console.log(productDetails);
        setBill(productDetails);
      } catch (error) {
        console.error('Error fetching bill details:', error);
      }
    };
  
    fetchBillDetails();
  }, [id]);
  

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <section className="invoice-container">
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>Invoice Summary</h2>
            <p>Invoice No: {id}</p>
            <table className="table">
              <thead>
                <tr>
                  
                  <th >Description</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th style={{textAlign:'right'}}>Price</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((item, index) => (
                  <tr key={index}>
                    
                    <td>{item.productName}</td>
                    <td >LKR {item.unitPrice}.00</td>
                    <td>{item.quantity}</td>
                    <td style={{textAlign:'right'}}>LKR {item.unitPrice * item.quantity}.00</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3">Total</th>
                  <th style={{textAlign:'right'}}>
                    LKR {bill.reduce((total, item) => total + item.unitPrice * item.quantity, 0)}.00
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BillDetails;
