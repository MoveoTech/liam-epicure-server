import express, { Router } from "express";
import { getAllDishes, getDishById, getSignatureDishes, postAddNewDish, putUpdateDish, deleteDish } from "handlers/dishes.handler";
const router: Router = express.Router();

// Get all dishes
router.get("", getAllDishes);

// Get signature dishes
router.get("/signature-dishes", getSignatureDishes);

// Add new chef to collection
router.post("", postAddNewDish);

// Update chef by ID
router.put("", putUpdateDish)

// Get dish by ID
router.get("/:id", getDishById);

// Remove chef by ID
router.delete("/:id", deleteDish);

export default router;