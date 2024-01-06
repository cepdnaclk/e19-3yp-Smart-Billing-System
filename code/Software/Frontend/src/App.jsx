import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signin_Page/Signup';
import Login from './Login_Page/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import Dashboard from './AdminDashboard/Dashboard/Dashboard';
import Invoices from './AdminDashboard/Invoices';
import Sales from './AdminDashboard/Sales';
import Security_Footage from './AdminDashboard/Security_Footage';
import Device_Status from './AdminDashboard/Device_Status';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<Login />} />

        <Route path='/AdminDashboard' element={<AdminDashboard/>}>
              <Route path='' element={<Dashboard/>}></Route>
              <Route path='/AdminDashboard/Invoices' element={<Invoices/>}></Route>
              <Route path='/AdminDashboard/Sales' element={<Sales/>}></Route> 
              <Route path='/AdminDashboard/Security_Footage' element={<Security_Footage/>}></Route> 
              <Route path='/AdminDashboard/Device_Status' element={<Device_Status/>}></Route>  
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
