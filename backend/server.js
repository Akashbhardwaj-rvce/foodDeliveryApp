const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection setup
// Replace the placeholders with your actual MongoDB connection string
mongoose.connect('mongodb://127.0.0.1:27017/food_ordering')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define the dish schema
const dishSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

const Dish = mongoose.model('Dish', dishSchema);

// Fetch the menu of dishes from the database
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await Dish.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle order placement requests
app.post('/api/orders', async (req, res) => {
  const { items } = req.body;

  try {
    // Save the order in the database
    const order = { items };
    // You can define an order schema and create a model if needed
    // For simplicity, we'll save the order directly without a separate schema/model
    const savedOrder = await Dish.collection.insertOne(order);
    res.json({ order: savedOrder.ops[0] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve order details and calculate total price and estimated delivery time
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Dish.findOne({ _id: orderId });

    // Calculate total price and estimated delivery time
    let totalPrice = 0;
    order.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    // Replace the placeholder with your actual delivery time calculation logic
    const estimatedDeliveryTime = '30 minutes';

    res.json({ order, totalPrice, estimatedDeliveryTime });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
