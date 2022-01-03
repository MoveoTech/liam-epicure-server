import express, { Router } from "express";
import { getAllIcons, postAddIcon, putUpdateIcon, deleteIcon, getIconById } from "handlers/icons.handler";
const router : Router = express.Router();

router.get("",getAllIcons);

router.post("",postAddIcon);

router.put("", putUpdateIcon);

router.get("/:id", getIconById);

router.delete("/:id", deleteIcon);

export default router;