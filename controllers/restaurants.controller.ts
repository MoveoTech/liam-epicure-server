import express, { Router } from "express";
import { deleteRestaurant, getAllRestaurants, getPopularRestaurants, getRestaurantById, getRestaurantDishesById, postAddNewRestaurant, putUpdateRestaurant } from "../handlers/restaurants.handler";
import auth from "../middlewares/routeAuth";
const router: Router = express.Router();

// Get all restaurants
router.get("", auth, getAllRestaurants);

// Get popular restaurants
router.get("/popular-restaurants", getPopularRestaurants); // No auth for Epicure users

// Add a new restaurant to collection
router.post("", auth, postAddNewRestaurant);

// Update restaurant by body object
router.put("", auth, putUpdateRestaurant);

// Get restaurant by ID
router.get("/:id", getRestaurantById); // No auth for future updates

// Remove restaurant by ID
router.delete("/:id", auth, deleteRestaurant);

// Get a restaurant's dishes
router.get("/dishes/:id", getRestaurantDishesById); // No auth for future updates

export default router;