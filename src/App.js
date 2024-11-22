import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage'; 
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Customerlogin from "./components/Customerlogin.js";
import Customerotp from './components/Customerotp.js';
import Customersign from './components/Customersign.js';
import Billpart from './Billpart'; 
import Admin from './Admin.js';
import Owner from './Owner.js'
import OrderDetails from './OrderDetails.js';
import Updatepart from './Updatepart.js';
import Invoicecompo from './Invoicecompo.js';
import Chart from "./Chart.js";
import Dishmanage from './Dishmanage.js';
import Upi from "./Upi.js";
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
import Customerorder from "./components/Customerorder.js"
import Successpage from "./Successpage.js"
import Failurepage from "./Failurepage.js"
import Customerprofile from "./components/Customerprofile.js"
import Login from "./Login.js";
import SignupPage from "./SignupPage.js";
import { UserProtectedRoute } from './components/UserProtectedRoute.js';
import {BuyerContext} from "./components/Buyercontext.js";
import Webuser from "./components/Webuser.js";
import CouponManager from "./components/CouponManager.js";
import Deliverydetail from "./components/Deliverydetail";
import Uniqueuser from "./components/Uniqueuser.js";
import Pos from "./Pos.js";
import AddRewardCoupon from './AddRewardCoupon.js';
import Wallet from "./Wallet.js"
import Wheel from "./Wheel.js"
import Dynamicqr from './Dynamicqr.js'
import Scratch from "./Scratch.js";
import Inventory from './Inventory.js'

const PaymentComponent = () => {
 
  return (
    <Router>
      <Routes>
      <Route path="/Splash" element={<Splash />} />
      <Route
          path="/:table"
          element={
              <Homepage />
          }
        />
        <Route path="/" element={<Homepage />} />  
        <Route path="/Owner" element={
           <ProtectedRoute>
           <Owner />
         </ProtectedRoute>
          } />
        <Route path="/Success" element={<Successpage/>} />
        <Route path="/Inventory" element={<Inventory/>} />
        <Route path="/Dyanmic" element={<Dynamicqr/>} />
      
        <Route path="/orders" element={<Customerorder/>} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/addreward" element={<AddRewardCoupon/>} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/web/signup" element={<Customersign/>} />
        <Route path="/web/login" element={<Customerlogin/>} />
        <Route path="/web/otp" element={<Customerotp/>} />
        <Route path="/Fail" element={<Failurepage/>} />
        <Route path="/docs/terms" element={<Termcondition/>} />
        <Route path="/docs/Contact" element={<Contactus/>} />
        <Route path="/docs/Refund" element={<Refundpolicy/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<SignupPage/>} />
        <Route path="/docs/Shippingdetail" element={<Shipping/>} />
        <Route path="/docs/About" element={<Aboutus/>} />
        <Route path="/docs/Privacy" element={<Privacy/>} />
        <Route path="/coupon" element={<CouponManager/>} />
        <Route path="/loyal/wheel/:qrid" element={< Wheel/>} />
        <Route path="/web/user" element={<Webuser/>} />
        <Route path="/delivery" element={<Deliverydetail/>} />
        <Route path="/docs/Cancel" element={<Cancellation/>} />
        <Route path="/Invoice/:_id" element={<Invoicecompo/>} />
        <Route path="/Order" element={
          <ProtectedRoute>
          <OrderDetails/>
          </ProtectedRoute>
          } />
        <Route path="/Billdata/:_id" element={<Billingpage/>} />
        <Route path="/Website" element={<Webisteorder/>} />
        <Route path="/Call" element={<Callwaiter/>} />
        <Route path="/loyal/card/:qrid/:reward" element={< Scratch/>} />
        <Route path="/Unique" element={<Uniqueuser/>} />
        <Route path="/Upi" element={<Upi/>} />
        <Route path="/Address" element={<Address/>} />
        <Route path="/Pay" element={<Googlepay/>} />
        <Route path="/Waiter" element={<Waiterpage/>} />
        <Route path="/Profit" element={<Profitpage/>} />
        <Route  path="/Month" element={<Month/>} />
        <Route  path="/profile" element={<Customerprofile/>} />
        <Route  path="/Admin " element={<Admin />} />
        <Route  path="/Chart" element={<Chart />} />
        <Route  path="/Sale" element={<Salechart />} />
        <Route  path="/Dishmanage" element={
          <ProtectedRoute>
             <Dishmanage />
          </ProtectedRoute>
          } />
          <Route
          path="/bill"
          element={
              <Billpart />
          }
        />
        <Route path="/update/:_id" element={
          <ProtectedRoute>
              <Updatepart />
          </ProtectedRoute>
          } />   
      </Routes>
    </Router>
  );
};

export default PaymentComponent;


