import express, { Router } from "express";
import { getAllDishes, getDishById, getSignatureDishes, postAddNewDish, putUpdateDish, deleteDish } from "../handlers/dishes.handler";
import auth from "../middlewares/routeAuth";
const router: Router = express.Router();

// Get all dishes
router.get("",auth, getAllDishes);

// Get signature dishes
router.get("/signature-dishes", getSignatureDishes); // No auth for Epicure users

// Add new chef to collection
router.post("", auth, postAddNewDish);

// Update chef by body object
router.put("", auth, putUpdateDish)

// Get dish by ID
router.get("/:id", getDishById); // No auth for future functionality in Epicure

// Remove chef by ID
router.delete("/:id", auth, deleteDish);

export default router;