"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const icons_handler_1 = require("handlers/icons.handler");
const routeAuth_1 = __importDefault(require("middlewares/routeAuth"));
const router = express_1.default.Router();
router.get("", icons_handler_1.getAllIcons); // No auth for Epicure users
router.post("", routeAuth_1.default, icons_handler_1.postAddIcon);
router.put("", routeAuth_1.default, icons_handler_1.putUpdateIcon);
router.get("/:id", icons_handler_1.getIconById); // No auth for future functionality
router.delete("/:id", routeAuth_1.default, icons_handler_1.deleteIcon);
exports.default = router;
