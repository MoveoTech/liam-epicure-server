import express, { Router } from "express";
import { deleteRestaurant, getAllRestaurants, getPopularRestaurants, getRestaurantById, getRestaurantDishesById, postAddNewRestaurant, putUpdateRestaurant } from "handlers/restaurants.handler";
const router: Router = express.Router();

// Get all restaurants
router.get("", getAllRestaurants);

// Get popular restaurants
router.get("/popular-restaurants", getPopularRestaurants);

// Add a new restaurant to collection
router.post("", postAddNewRestaurant);

// Update restaurant by ID
router.put("", putUpdateRestaurant);

// Get restaurant by ID
router.get("/:id", getRestaurantById);

// Remove restaurant by ID
router.delete("/:id", deleteRestaurant);

// Get a restaurant's dishes
router.get("/dishes/:id", getRestaurantDishesById);

export default router;