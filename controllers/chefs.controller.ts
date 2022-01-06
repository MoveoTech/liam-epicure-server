import express, { Router } from "express";
import { deleteChef, getAllChefs, getChefById, getWeeklyChef, postAddNewChef, putUpdateChef } from "../handlers/chefs.handler";
import auth from "../middlewares/routeAuth";
const router: Router = express.Router();

// Get all chefs
router.get("", auth, getAllChefs);

// Get 'chef of the week'
router.get("/weekly-chef", getWeeklyChef); // No Auth MW for Epicure users

// Add new chef to collection
router.post("", auth, postAddNewChef);

// Update chef by body object
router.put("", auth, putUpdateChef)

// Get chef by ID
router.get("/:id", getChefById); // No auth for future option to search by ID

// Remove chef by ID
router.delete("/:id", auth, deleteChef);

export default router;