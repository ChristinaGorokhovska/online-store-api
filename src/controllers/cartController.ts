import { Request, Response } from "express";
import Cart from "../models/CartModel";
import Product from "../models/Product";
import { Types } from "mongoose";
import { ICartProductItem } from "../models/types";

// Get cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const foundCart = await Cart.findOne({ userId: req.userId }).exec();
    if (!foundCart) return res.status(400).json({ message: "Cart is not found" });

    return res.status(200).json({ cart: foundCart });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
// Add product to cart
export const addProductToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "Properties are required" });

    const foundCart = await Cart.findOne({ userId: req.userId }).exec();
    const product = await Product.findOne({ _id: productId }).exec();
    if (!product) return res.status(400).json({ message: "Product is not found" });

    if (product.quantity < quantity)
      return res
        .status(409)
        .json({ message: "A quantity is incorrect: the avaliable quantity of product is less than the specified" });

    const price = product.price;

    if (foundCart) {
      const productIndex = foundCart.products.findIndex((product: ICartProductItem) => product.productId == productId);

      if (productIndex > -1) {
        let currentProduct = foundCart.products[productIndex];

        if (product.quantity < currentProduct.quantity + quantity)
          return res.status(409).json({
            message:
              "A quantity is incorrect: the avaliable quantity of product is less than the specified in addition to current",
          });

        currentProduct.quantity += quantity;
        foundCart.bill = foundCart.products.reduce((prev: number, curr: ICartProductItem) => {
          return prev + curr.quantity * curr.price;
        }, 0);
        foundCart.products[productIndex] = currentProduct;

        foundCart.save();
        return res.status(200).json({ message: "A product is added" });
      } else {
        foundCart.products.push({ productId, quantity, price });
        foundCart.bill = foundCart.products.reduce((prev: number, curr: ICartProductItem) => {
          return prev + curr.quantity * curr.price;
        }, 0);

        foundCart.save();
        return res.status(200).json({ message: "A product is added" });
      }
    } else {
      const newCart = new Cart({
        _id: new Types.ObjectId(),
        userId: req.userId,
        products: [{ productId, quantity, price }],
        bill: quantity * price,
      });

      newCart.save();
      return res.status(200).json({ message: "A cart is created and a product is added" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Decrease quantity of product
export const decreaseQuantityOfProduct = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "Properties are required" });

    const foundCart = await Cart.findOne({ userId: req.userId }).exec();
    const product = await Product.findOne({ _id: productId }).exec();
    if (!foundCart) return res.status(400).json({ message: "Cart is not found" });
    if (!product) return res.status(400).json({ message: "Product is not found" });

    const productIndex = foundCart.products.findIndex((product: ICartProductItem) => product.productId == productId);
    if (productIndex < 0) return res.status(400).json({ message: "A product is not found" });

    const currentProduct = foundCart.products[productIndex];
    if (currentProduct.quantity < quantity || currentProduct.quantity - quantity < 0)
      return res.status(409).json({
        message: "A quantity is incorrect: the quantity of current product is less than the specified decrease value",
      });

    if (currentProduct.quantity == quantity) {
      foundCart.deleteOne();
      return res.status(200).json({ message: "A product is deleted" });
    }
    foundCart.products[productIndex].quantity -= quantity;
    foundCart.bill = foundCart.products.reduce((prev: number, curr: ICartProductItem) => {
      return prev + curr.quantity * curr.price;
    }, 0);

    foundCart.save();
    return res.status(200).json({ message: "The product`s quantity is decreased" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Delete product from Cart
export const deleteProductFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product`s id is required" });
    const foundCart = await Cart.findOne({ userId: req.userId }).exec();
    if (!foundCart) return res.status(400).json({ message: "Cart is not found" });

    const productIndex = foundCart.products.findIndex((product: ICartProductItem) => product.productId == productId);
    if (productIndex < 0) return res.status(400).json({ message: "A product is not found" });

    foundCart.products.splice(productIndex, 1);
    foundCart.bill = foundCart.products.reduce((prev: number, curr: ICartProductItem) => {
      return prev + curr.quantity * curr.price;
    }, 0);

    if (foundCart.products.length) {
      foundCart.save();
    } else {
      foundCart.deleteOne();
    }

    return res.status(200).json({ message: "A product is deleted from cart" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
