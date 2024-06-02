// server.js
const express = require('express');
const cors=require("cors");
const mongoose=require("mongoose");

const bodyParser=require("body-parser");
const Razorpay = require('razorpay');
require('dotenv').config(); 


const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 1000;

app.use(express.json());
app.use(cors({  origin: ['http://localhost:3000', 'https://large-comics-attend.loca.lt'] }));


const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

app.post('/api/orders', (req, res) => {
  const options = {
    amount: req.body.amount, // amount in paisa (e.g., 50000 for ₹500)
    currency: 'INR',
  };

  razorpay.orders.create(options, (error, order) => {
    if (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
    res.json({ orderId: order.id });
  });
});

mongoose.connect("mongodb+srv://raunak:dogtail@socialapi.jmjdnqv.mongodb.net/?retryWrites=true&w=majority&appName=socialapi")
  .then(() => {
    console.log('Connected!')
  }).catch((error)=>{
    console.log(error);
  })


  const cartItemSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    category: { type: String },
    rating: { type: Number },
    price: { type: String },
    image: { type: String },
    description: { type: String },
    quantity:{ type : Number}
  });

const paymentSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    name:String,
    amount:Number,
    customerTable:{type: String, default: 'Table 1'},
    customerPhoneNo:String,
    cartforpayment: [cartItemSchema]
   }, {
  timestamp:true
});
  
  const Payment = mongoose.model('Payment', paymentSchema);
  
  // Route to handle payment details
  app.post('/api/payments', async (req, res) => {
    try {
      const { orderId,paymentId,name,amount,customerTable,customerPhoneNo,cartforpayment} = req.body;
      const payment = new Payment({ orderId,paymentId,name,amount,customerTable,customerPhoneNo,cartforpayment });
      await payment.save();
      res.status(201).json({ message: 'Payment details saved successfully' });
    } catch (error) {
      console.error('Error saving payment details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.get("/check",(req,res)=>{
  res.send("i am server");
})
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
