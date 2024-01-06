import React, { useState, useEffect } from "react";
import "./Invoices.css";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({});
  const formattedNewInvoice = {
    data: [newInvoice]
  };
  

  const handleCreate = async () => {
    console.log("Creating invoice:", newInvoice);
    try {
      const response = await fetch("http://localhost:5555/bill/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInvoice),
        
      });
  
      if (!response.ok) {
        // Check if the response status is not in the range 200-299
        throw new Error(`Failed to create invoice. Status: ${response.status}`);
      }
  
      const createdInvoice = await response.json();
  
      // Check if the response has the expected structure
      if (createdInvoice && createdInvoice._id) {
        setInvoices([...invoices, createdInvoice]);
        setNewInvoice({}); // Clear the form after creating a new invoice
      } else {
        console.error("Invalid response format after creating invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };
  
/*
  const handleUpdate = async (id, updatedData) => {
    const { updatedInvoiceId, updatedDate, updatedAmount } = updatedData;

  //Display the update space
  document.getElementById("update-space").style.display = "block";

  // Populate the updated data in the space
  document.getElementById("updated-invoice-id").innerText = updatedInvoiceId;
  document.getElementById("updated-date").innerText = updatedDate;
  document.getElementById("updated-amount").innerText = updatedAmount;
    try {
      const response = await fetch(`http://localhost:5555/bill/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const updatedInvoice = await response.json();
      // Update the state with the updated invoice
      setInvoices(invoices.map((invoice) => (invoice.id === _id ? updatedInvoice : invoice)));
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };*/

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5555/bill/${id}`, {
        method: "DELETE",
      });

      // Remove the deleted invoice from the state
        setInvoices(invoices.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5555/bill/");
        const responseData = await response.json();
        console.log("Data from API:", responseData);
  
        if (responseData.count > 0) {
          setInvoices(responseData.data);
        } else {
          console.error("Invalid data format received from the API.");
          setInvoices([]); // Set an empty array as a fallback
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setInvoices([]); // Set an empty array on error
      }
    };
  
    fetchData();
  }, []);
  
  
  return (
    <div>
      <h2>Invoices Details</h2>

      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Discount Applied</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice._id}</td>
              <td>{invoice.createdAt}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.discountApplied}</td>
              <td>{invoice.paymentMethod}</td>
              <td>
                <button onClick={() => handleUpdate(invoice.id, {/* Updated data */})}>
                  Update
                </button>
            <button onClick={() => handleDelete(invoice._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



            <br/><br/> <br/>
      <div>
        <h5>Create New Invoice</h5>
        <form>
          <label>Amount:</label>
          <input
            type="text"
            value={newInvoice.totalAmount || ""}
            onChange={(e) => setNewInvoice({ ...newInvoice, totalAmount: e.target.value })}
          />
          
          <label>Payment Method:</label>
          <input
            type="text"
            value={newInvoice.paymentMethod || ""}
            onChange={(e) => setNewInvoice({ ...newInvoice, paymentMethod: e.target.value })}
          />
          
          <label>Discount Applied:</label>
          <input
            type="text"
            value={newInvoice.discountApplied || ""}
            onChange={(e) => setNewInvoice({ ...newInvoice, discountApplied: e.target.value })}
          />
          
          <button className="customButton" type="button" onClick={handleCreate}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default Invoices;
