"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dishes_handler_1 = require("../handlers/dishes.handler");
const routeAuth_1 = __importDefault(require("../middlewares/routeAuth"));
const router = express_1.default.Router();
// Get all dishes
router.get("", routeAuth_1.default, dishes_handler_1.getAllDishes);
// Get signature dishes
router.get("/signature-dishes", dishes_handler_1.getSignatureDishes); // No auth for Epicure users
// Add new chef to collection
router.post("", routeAuth_1.default, dishes_handler_1.postAddNewDish);
// Update chef by body object
router.put("", routeAuth_1.default, dishes_handler_1.putUpdateDish);
// Get dish by ID
router.get("/:id", dishes_handler_1.getDishById); // No auth for future functionality in Epicure
// Remove chef by ID
router.delete("/:id", routeAuth_1.default, dishes_handler_1.deleteDish);
exports.default = router;
