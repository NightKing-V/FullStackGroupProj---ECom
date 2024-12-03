const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const fetch = require('node-fetch');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get the cart data for the user
    const cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Your cart is empty. Add products to the cart first." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shippingAddress = user.address;
    let totalAmount = 0;

    // Prepare the order items
    const orderProducts = cart.products.map((item) => {
      const totalPrice = item.quantity * item.product.Price;
      totalAmount += totalPrice;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.Price,
        totalPrice,
      };
    });

    // Create a new order (set it as "Pending" for now)
    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      orderStatus: "Unpaid", // Order is pending until payment is successful
    });

    await order.save();

    // Clear the cart after the order is created
    await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });

    // Initiate the payment session
    const paymentResponse = await fetch(`${process.env.PAYMENT_GATEWAY_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalAmount,  // Total amount for the payment
        currency: "LKR",
        reference_id: order._id,   // Pass the order ID
      }),
    });

    const paymentData = await paymentResponse.json();
    if (paymentData.paymentUrl) {
      // Respond with the payment URL to the frontend
      return res.status(201).json({
        message: 'Unpaid order created, awaiting payment.',
        orderId: order._id,
        paymentUrl: paymentData.paymentUrl,  // Send payment URL to frontend
      });
    } else {
      // If payment initiation fails, handle the error
      return res.status(500).json({ error: 'Payment initiation failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error while creating order' });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {orderId} = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to cancel this order" });
    }

    if (order.orderStatus !== "Pending") {
      return res
        .status(400)
        .json({
          error:
            "This order cannot be cancelled because it is already processed or shipped.",
        });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while cancelling the order" });
  }
};

exports.listUserOrders = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const orders = await Order.find({ user: userId })
        .populate({
          path: 'products.product',
          select: 'Name Price'
        });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      const formattedOrders = orders.map(order => {
        const products = order.products.map(item => {
          const totalPrice = item.quantity * item.product.Price;
          return {
            productId: item.product._id,
            productName: item.product.Name,
            quantity: item.quantity,
            price: item.product.Price,
            totalPrice: totalPrice,
          };
        });
  
        return {
          orderId: order._id,
          products: products,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          orderStatus: order.orderStatus,
          orderDate: order.createdAt,
        };
      });
  
      return res.status(200).json({ orders: formattedOrders });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error while fetching orders" });
    }
  };
  
  exports.updateOrder = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { status, orderId } = req.body;

      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status' });
      }

      const order = await Order.findOne({ _id: orderId, user: userId });
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found or user is not authorized to update this order' });
      }
      if(order.orderStatus != "Cancelled"){
          order.orderStatus = status;
          await order.save();
      
          return res.status(200).json({
            message: 'Order status updated successfully',
            order: {
              orderId: order._id,
              orderStatus: order.orderStatus,
              products: order.products,
              totalAmount: order.totalAmount,
              shippingAddress: order.shippingAddress,
              orderDate: order.createdAt,
            }
          });
      }else{
        return res.status(400).json({message: 'Order already Cancelled'});
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error while updating order status' });
    }
  };

  exports.paymentCallback = async (req, res) => {
    try {
      const { reference_id, paymentStatus } = req.body;  // Assuming paymentStatus is passed as query param
      const orderId = reference_id;
      console.log(reference_id)
      // Retrieve the order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      if (order.orderStatus !== 'Unpaid') {
        return res.status(400).json({ error: 'Order has already been processed' });
      }
  
      // If payment is successful, update order status to "Completed"
      if (paymentStatus === 'success') {
        order.orderStatus = 'Pending';
        await order.save();
        
        return res.status(200).json({ status:"success", message: 'Payment successful, order completed' });
      } else {
        // Handle payment failure (optional)
        order.orderStatus = 'Failed';
        await order.save();
        
        return res.status(400).json({ error: 'Payment failed, order not completed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error processing payment' });
    }
  };
  