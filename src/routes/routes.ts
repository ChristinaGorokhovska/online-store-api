import {
  createCustomer,
  deleteCustomer,
  editCustomerProfile,
  readCuctomerProfile,
} from "../controllers/customerController";
import verifyToken from "../middleware/verifyToken";
import { loginUser } from "../controllers/loginController";
import {
  addProductToCart,
  decreaseQuantityOfProduct,
  deleteProductFromCart,
  getCart,
} from "../controllers/cartController";
import { createProduct, getProduct } from "../controllers/productController";
import { logoutUser } from "../controllers/logoutController";
import { changeEmail } from "../controllers/emailController";
import { cancelOrder, createOrder, getOrders, submitOrder } from "../controllers/orderController";
import verifyRoles from "../middleware/verifyRoles";
import ROLES from "../roles";
import { refreshToken } from "../controllers/refreshTokenController";
import { Router } from "express";
const routes = Router();

// Create user
routes.post("/signup", createCustomer);
routes.post("/signin", loginUser);
routes.post("/logout", verifyToken, logoutUser);

// Refresh token
routes.post("/refresh-token", refreshToken);

// Delete user
routes.delete("/profile", verifyToken, deleteCustomer);

// Edit profile
routes.patch("/profile", verifyToken, editCustomerProfile);
routes.put("/user/email", verifyToken, changeEmail);

// Read customer`s profile
routes.get("/profile", verifyToken, readCuctomerProfile);

// Get info about specific product
routes.get("/products/:productId", verifyToken, getProduct);

// Get cart
routes.get("/cart", verifyToken, getCart);

// Add product to cart
routes.post("/cart/product", verifyToken, addProductToCart);

// Decrease quantity of product in cart
routes.post("/cart/product/decreasing", verifyToken, decreaseQuantityOfProduct);

// Delete product from cart
routes.delete("/cart/product", verifyToken, deleteProductFromCart);

// Create order
routes.post("/orders", verifyToken, createOrder);

// Get customer`s orders
routes.get("/orders", verifyToken, getOrders);

// Cancel order
routes.put("/orders/:orderId/cancellation", verifyToken, cancelOrder);

// Submit order by Admin
routes.put("/orders/:orderId/submitting", verifyToken, verifyRoles([ROLES.Admin]), submitOrder);

// Create product by Admin
routes.post("/product", verifyToken, verifyRoles([ROLES.Admin]), createProduct);

export default routes;
