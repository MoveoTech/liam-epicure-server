"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurants_handler_1 = require("../handlers/restaurants.handler");
const routeAuth_1 = __importDefault(require("../middlewares/routeAuth"));
const router = express_1.default.Router();
// Get all restaurants
router.get("", routeAuth_1.default, restaurants_handler_1.getAllRestaurants);
// Get popular restaurants
router.get("/popular-restaurants", restaurants_handler_1.getPopularRestaurants); // No auth for Epicure users
// Add a new restaurant to collection
router.post("", routeAuth_1.default, restaurants_handler_1.postAddNewRestaurant);
// Update restaurant by body object
router.put("", routeAuth_1.default, restaurants_handler_1.putUpdateRestaurant);
// Get restaurant by ID
router.get("/:id", restaurants_handler_1.getRestaurantById); // No auth for future updates
// Remove restaurant by ID
router.delete("/:id", routeAuth_1.default, restaurants_handler_1.deleteRestaurant);
// Get a restaurant's dishes
router.get("/dishes/:id", restaurants_handler_1.getRestaurantDishesById); // No auth for future updates
exports.default = router;
