import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage'; // Make sure these paths are correct
import Billpart from './Billpart'; // Make sure these paths are correct
import { CustomerContext } from './CustomerContext';
import { Link,useNavigate } from 'react-router-dom';
import Admin from './Admin.js';
import Owner from './Owner.js'
import OrderDetails from './OrderDetails.js';
import Updatepart from './Updatepart.js';
import Invoicecompo from './Invoicecompo.js';
import { useHistory } from 'react-router-dom';
import Dishmanage from './Dishmanage.js';

const PaymentComponent = () => {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Owner" element={<Owner/>} />
        <Route path="/Invoice" element={<Invoicecompo/>} />
        <Route path="/Order" element={<OrderDetails/>} />
        <Route  path="/Admin " element={<Admin />} />
        <Route  path="/Dishmanage" element={<Dishmanage />} />
        <Route path="/bill" element={<Billpart  />} />
         <Route path="/update/:_id" element={<Updatepart />} />   
      </Routes>
    </Router>
  );
};

export default PaymentComponent;


