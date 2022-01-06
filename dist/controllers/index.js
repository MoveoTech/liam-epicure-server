"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = exports.iconsController = exports.restaurantsController = exports.dishesController = exports.chefsController = void 0;
const chefs_controller_1 = __importDefault(require("../controllers/chefs.controller"));
exports.chefsController = chefs_controller_1.default;
const dishes_controller_1 = __importDefault(require("../controllers/dishes.controller"));
exports.dishesController = dishes_controller_1.default;
const restaurants_controller_1 = __importDefault(require("../controllers/restaurants.controller"));
exports.restaurantsController = restaurants_controller_1.default;
const icons_controller_1 = __importDefault(require("../controllers/icons.controller"));
exports.iconsController = icons_controller_1.default;
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
exports.usersController = users_controller_1.default;
