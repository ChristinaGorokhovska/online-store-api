import { Types } from "mongoose";

export enum role {
  admin = "admin",
  customer = "customer",
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: role;
  refreshToken: {
    token: string;
    modifiedAt: Date;
  };
}

interface IAddress {
  country: string;
  city: string;
  state: string;
  street: string;
  building: string;
}

interface IName {
  firstName: string;
  lastName: string;
}

export interface ICustomer {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: IName;
  birthDate: Date;
  phone: string;
  shippingAddress: IAddress;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  image: string;
  quantity: number;
  price: number;
  categories: string[];
  tags: string[];
  description: string;
}

export interface ICartProductItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  products: ICartProductItem[];
  bill: number;
}

export enum statusOrder {
  submitted = "submitted",
  unprocessed = "unprocessed",
  cancelled = "cancelled",
}

interface IOrderProductItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  products: IOrderProductItem[];
  bill: number;
  status: statusOrder;
}
