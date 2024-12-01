const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ error: "Your cart is empty. Add products to the cart first." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shippingAddress = user.address;

    let totalAmount = 0;
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

    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
    });

    await order.save();

    await Cart.updateOne({ user: userId }, { $set: { products: [] } });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while placing the order" });
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