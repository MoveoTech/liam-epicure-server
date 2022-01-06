import express, { Router } from "express";
import { getAllIcons, postAddIcon, putUpdateIcon, deleteIcon, getIconById } from "handlers/icons.handler";
import auth from "middlewares/routeAuth";
const router: Router = express.Router();

router.get("", getAllIcons); // No auth for Epicure users

router.post("", auth, postAddIcon);

router.put("", auth, putUpdateIcon);

router.get("/:id", getIconById); // No auth for future functionality

router.delete("/:id", auth, deleteIcon);

export default router;