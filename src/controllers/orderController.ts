import { Request, Response } from "express";
import Cart from "../models/CartModel";
import Order from "../models/OrderModel";
import { Types } from "mongoose";
import { statusOrder } from "../models/types";

// Create order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const foundCart = await Cart.findOne({ userId: req.userId }).exec();
    if (!foundCart) return res.status(400).json({ message: "Cart is not found" });

    await Cart.findOneAndDelete({ userId: req.userId });

    const newOrder = new Order({
      _id: new Types.ObjectId(),
      userId: req.userId,
      products: foundCart.products,
      bill: foundCart.bill,
    });
    newOrder.save();

    return res.status(200).json({ message: " An order has been created: in processing", orderId: newOrder._id });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order`s id is required" });

    const foundOrder = await Order.findOne({ _id: orderId, userId: req.userId }).exec();
    if (!foundOrder) return res.status(400).json({ message: "Order is not found" });

    foundOrder.status = statusOrder.cancelled;
    foundOrder.save();

    return res.status(200).json({ message: "An order is cancelled" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Submit order by Admin
export const submitOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order`s id is required" });

    const foundOrder = await Order.findOne({ _id: orderId }).exec();
    if (!foundOrder) return res.status(400).json({ message: "Order is not found" });

    foundOrder.status = statusOrder.submitted;
    foundOrder.save();

    return res.status(200).json({ message: "An order is submitted" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Get customer`s orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const foundOrders = await Order.find({ userId: req.userId }).exec();
    if (!foundOrders.length) return res.status(200).json({ message: "No orders", orders: [] });
    return res.status(200).json({ orders: foundOrders });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
