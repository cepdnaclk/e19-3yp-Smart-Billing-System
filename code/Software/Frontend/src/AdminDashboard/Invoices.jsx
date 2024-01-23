import React, { useState, useEffect } from "react";
import "./Invoices.css";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({});
  const [updateSpaceVisible, setUpdateSpaceVisible] = useState(false);
  const [updatedInvoiceData, setUpdatedInvoiceData] = useState({});
  const [updateFormData, setUpdateFormData] = useState({
    totalAmount: "",
    paymentMethod: "",
    discountApplied: "",
  });

  const fetchURL = "https://4e9eq7iw62.execute-api.ap-southeast-1.amazonaws.com/v1/";
  
  const handleUpdateInputChange = (e, id) => {
    const { name, value } = e.target;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: value,
      },
    }));
  };
  const handleCreate = async () => {
    console.log("Creating invoice:", newInvoice);
    try {
      const response = await fetch(fetchURL + "bill/", {
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
  

  const handleUpdate = async (id) => {
    //console.log("Updating invoice:", id);
    console.log("Updated invoice data:", updateFormData);
    try {
      const response = await fetch(fetchURL + `bill/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData[id]),
      });

      if (!response.ok) {
        throw new Error(`Failed to update invoice. Status: ${response.status}`);
      }

      const updatedInvoice = await response.json();
      console.log("Updated invoice:", updatedInvoice);
      setInvoices(invoices.map((invoiceItem) => (invoiceItem._id === id ? { ...updatedInvoice } : invoiceItem)));

      setUpdatedInvoiceData({
        updatedInvoiceId: updatedInvoice._id,
        updatedDate: updatedInvoice.createdAt,
        updatedAmount: updatedInvoice.totalAmount,
      });

      // Set update space visible
      setUpdateSpaceVisible(true);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      //await fetch("http://localhost:5555/bill/" + id, {
      await fetch(fetchURL + `bill/${id}`, {
        method: "DELETE",
      });
      //await fetch("http://localhost:5555/itemPurchased/bill/" + id, {
      await fetch(fetchURL + `itemPurchased/bill/${id}`, {
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
    <td>{invoice.totalAmount}
   {/**  <form >
        
        <input
          type="text"
          name="totalAmount"
          value={updateFormData[invoice._id]?.totalAmount || ""}
          onChange={(e) => handleUpdateInputChange(e, invoice._id)}
          style={{ width: '70px',height:'27px',borderRadius:'1px'}}
        />
    </form>*/}
    </td>

    <td>{invoice.discountApplied}
    {/*<form className="custom-form">
    
        <input
          type="text"
          name="discountApplied"
          value={updateFormData[invoice._id]?.discountApplied || ""}
          onChange={(e) => handleUpdateInputChange(e, invoice._id)}
          style={{ width: '90px',height:'27px',borderRadius:'1px'}}
  /></form>*/}
    </td>
    <td>{invoice.paymentMethod}
   {/* <form >
            
                <input
                type="text"
                name="paymentMethod"
                value={updateFormData[invoice._id]?.paymentMethod || ""}
                onChange={(e) => handleUpdateInputChange(e, invoice._id)}
                style={{ width: '100px' ,height:'27px',borderRadius:'1px'}}
                />
    </form> */}
    </td>
    <td>
      

       {/*  <button type="button" onClick={() => handleUpdate(invoice._id)}>
          Update
        </button>*/}
      
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
