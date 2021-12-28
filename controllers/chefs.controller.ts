import express, { Router } from "express";
import { deleteChef, getAllChefs, getChefById, getWeeklyChef, postAddNewChef, putUpdateChef } from "handlers/chefs.handler";
const router: Router = express.Router();

// Get all chefs
router.get("", getAllChefs);

// Get 'chef of the week'
router.get("/weekly-chef", getWeeklyChef);

// Add new chef to collection
router.post("", postAddNewChef);

// Update chef by ID
router.put("", putUpdateChef)

// Get chef by ID
router.get("/:id", getChefById);

// Remove chef by ID
router.delete("/:id", deleteChef);

export default router;