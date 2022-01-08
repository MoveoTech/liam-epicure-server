"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chefs_handler_1 = require("../handlers/chefs.handler");
const routeAuth_1 = __importDefault(require("../middlewares/routeAuth"));
const router = express_1.default.Router();
// Get all chefs
router.get("", routeAuth_1.default, chefs_handler_1.getAllChefs);
// Get 'chef of the week'
router.get("/weekly-chef", chefs_handler_1.getWeeklyChef); // No Auth MW for Epicure users
// Update weekly chef
router.put("/weekly-chef", routeAuth_1.default, chefs_handler_1.putWeeklyChef);
// Add new chef to collection
router.post("", routeAuth_1.default, chefs_handler_1.postAddNewChef);
// Update chef by body object
router.put("", routeAuth_1.default, chefs_handler_1.putUpdateChef);
// Get chef by ID
router.get("/:id", chefs_handler_1.getChefById); // No auth for future option to search by ID
// Remove chef by ID
router.delete("/:id", routeAuth_1.default, chefs_handler_1.deleteChef);
exports.default = router;
