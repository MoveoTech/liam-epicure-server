"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_handler_1 = require("../handlers/users.handler");
const loginAuth_1 = __importDefault(require("../middlewares/loginAuth"));
const guardAuth_1 = __importDefault(require("../middlewares/guardAuth"));
const router = express_1.default.Router();
router.get("", guardAuth_1.default);
router.get("/login", loginAuth_1.default);
router.post("/login", users_handler_1.postLogin);
exports.default = router;
