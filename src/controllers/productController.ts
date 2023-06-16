import { Request, Response } from "express";
import Product from "../models/Product";
import { Types } from "mongoose";

// Get product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "Pruduct`s id is required" });

    const product = await Product.findOne({ _id: productId }).exec();
    if (!product) return res.status(400).json({ message: "Product is not found" });

    return res.status(200).json({ product: product });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, image, quantity, price, categories, tags, description } = req.body;

    if (!name || !quantity || !price || !categories)
      return res.status(400).json({ message: "Pruduct`s id is required" });

    const newProduct = new Product({
      _id: new Types.ObjectId(),
      name: name,
      image: image,
      quantity: quantity,
      price: price,
      categories: categories,
      tags: tags,
      description: description,
    });

    newProduct.save();
    return res.status(200).json({ message: "Product is created", product: newProduct });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
