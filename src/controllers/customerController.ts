import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/UserModel";
import Customer from "../models/CustomerModel";
import Cart from "../models/CartModel";
import { role } from "../models/types";
import Order from "../models/OrderModel";

// Create Customer (new User)
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userRole, email, password, phone, birthDate, country, city, state, street, building } =
      req.body;

    if (!firstName || !lastName || !email || !password || !phone)
      return res.status(400).json({ message: "Properties are required" });

    if (await User.findOne({ email: email }).exec())
      return res.status(409).json({ message: `User with such email (${email}) exists` });

    const hashPassword = bcrypt.hashSync(password, 8);
    const id = new Types.ObjectId();

    const newUser = new User({
      _id: id,
      email: email,
      password: hashPassword,
      role: userRole || role.customer,
      refreshToken: {
        token: "",
        modifiedAt: Date.now(),
      },
    });

    const newCustomer = new Customer({
      _id: new Types.ObjectId(),
      userId: id,
      name: {
        firstName: firstName,
        lastName: lastName,
      },
      phone: phone,
      birthDate: birthDate,
      shippingAddress: {
        country: country,
        city: city,
        state: state,
        street: street,
        building: building,
      },
    });

    newUser.save();
    newCustomer.save();

    return res.status(200).json({ message: "User is registered" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findOne({ _id: req.userId }).exec();
    if (!foundUser) return res.status(409).json({ message: "User is not found" });

    const foundCustomer = await Customer.findOne({ userId: req.userId }).exec();
    if (!foundCustomer) return res.status(409).json({ message: "Customer is not found" });

    await User.findOneAndDelete({ _id: req.userId });
    await Customer.findOneAndDelete({ userId: req.userId });
    await Cart.findOneAndDelete({ userId: req.userId });
    await Order.deleteMany({ userId: req.userId });

    return res
      .status(200)
      .json({ message: "User is deleted" })
      .clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Edit profile
export const editCustomerProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, birthDate, country, city, state, street, building } = req.body;

    const foundCustomer = await Customer.findOne({ userId: req.userId }).exec();
    if (!foundCustomer) return res.status(409).json({ message: "Customer is not found" });

    if (firstName) foundCustomer.name.firstName = firstName;
    if (lastName) foundCustomer.name.lastName = lastName;
    if (phone) foundCustomer.phone = phone;
    if (birthDate) foundCustomer.birthDate = birthDate;
    if (country) foundCustomer.shippingAddress.country = country;
    if (city) foundCustomer.shippingAddress.city = city;
    if (state) foundCustomer.shippingAddress.state = state;
    if (street) foundCustomer.shippingAddress.street = street;
    if (building) foundCustomer.shippingAddress.building = building;

    foundCustomer.save();
    return res.status(200).json({ message: "User`s profile is edited" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Read profile
export const readCuctomerProfile = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findOne({ _id: req.userId }).exec();
    if (!foundUser) return res.status(409).json({ message: "User is not found" });

    const foundCustomer = await Customer.findOne({ userId: req.userId }).exec();
    if (!foundCustomer) return res.status(409).json({ message: "Customer is not found" });

    const profile = await Customer.aggregate([
      { $match: { userId: new Types.ObjectId(req.userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersData",
        },
      },
      { $unwind: "$usersData" },
      {
        $addFields: {
          email: "$usersData.email",
        },
      },
      { $project: { _id: 0, __v: 0, usersData: 0 } },
    ]);

    return res.status(200).json({ profile: profile });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
