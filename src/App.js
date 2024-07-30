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
import Webisteorder from './Webisteorder.js';
import Billingpage from "./Billingpage.js";
import Splash from './Splash.js';
import Termcondition from './documents/Termcondition.js';
import Refundpolicy from './documents/Refundpolicy.js';
import Shipping from './documents/Shipping.js';
import Aboutus from "./documents/Aboutus.js";
import Privacy from "./documents/Privacy.js"
import Cancellation from './documents/Cancellation.js';
import Contactus from "./documents/Contactus.js";
import Googlepay from './Googlepay.js';
import Successpage from "./Successpage.js"
import Failurepage from "./Failurepage.js"

const PaymentComponent = () => {
 
  return (
    <Router>
      <Routes>
      <Route path="/Splash" element={<Splash />} />
        <Route path="/:table" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />  
        <Route path="/Owner" element={<Owner/>} />
        <Route path="/Success" element={<Successpage/>} />
        <Route path="/Fail" element={<Failurepage/>} />
        <Route path="/docs/terms" element={<Termcondition/>} />
        <Route path="/docs/Contact" element={<Contactus/>} />
        <Route path="/docs/Refund" element={<Refundpolicy/>} />
        <Route path="/docs/Shippingdetail" element={<Shipping/>} />
        <Route path="/docs/About" element={<Aboutus/>} />
        <Route path="/docs/Privacy" element={<Privacy/>} />
        <Route path="/docs/Cancel" element={<Cancellation/>} />
        <Route path="/Invoice/:_id" element={<Invoicecompo/>} />
        <Route path="/Order" element={<OrderDetails/>} />
        <Route path="/Billdata/:_id" element={<Billingpage/>} />
        <Route path="/Website" element={<Webisteorder/>} />
        <Route path="/Call" element={<Callwaiter/>} />
        <Route path="/Address" element={<Address/>} />
        <Route path="/Pay" element={<Googlepay/>} />
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


