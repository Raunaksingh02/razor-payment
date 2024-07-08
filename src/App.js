import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage'; 
import Billpart from './Billpart'; 
import Admin from './Admin.js';
import Owner from './Owner.js'
import OrderDetails from './OrderDetails.js';
import Updatepart from './Updatepart.js';
import Invoicecompo from './Invoicecompo.js';
import Chart from "./Chart.js";
import Dishmanage from './Dishmanage.js';
import Callwaiter from './Callwaiter.js';
import Waiterpage from './Waiterpage.js';
import Profitpage from './Profitpage.js';
import Salechart from "./Salechart.js";
import Month from "./Month.js"
import Address from "./Address.js";

const PaymentComponent = () => {
 
  return (
    <Router>
      <Routes>
        <Route path="/:table" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/Owner" element={<Owner/>} />
        <Route path="/Invoice" element={<Invoicecompo/>} />
        <Route path="/Order" element={<OrderDetails/>} />
        <Route path="/Call" element={<Callwaiter/>} />
        <Route path="/Address" element={<Address/>} />
        <Route path="/Waiter" element={<Waiterpage/>} />
        <Route path="/Profit" element={<Profitpage/>} />
        <Route  path="/Month" element={<Month/>} />
        <Route  path="/Admin " element={<Admin />} />
        <Route  path="/Chart" element={<Chart />} />
        <Route  path="/Sale" element={<Salechart />} />
        <Route  path="/Dishmanage" element={<Dishmanage />} />
        <Route path="/bill" element={<Billpart  />} />
        <Route path="/update/:_id" element={<Updatepart />} />   
      </Routes>
    </Router>
  );
};

export default PaymentComponent;


