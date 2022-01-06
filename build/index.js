"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { connect } from "./middlewares/dbConnect";
const index_1 = require("controllers/index");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const configFile_1 = require("configFile");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json()); // Parses body objects as JSON
app.use(body_parser_1.default.urlencoded({ extended: false })); // make sure url params are of type string / array.
// Controllers
app.use("/api/users", index_1.usersController);
app.use("/api/chefs", index_1.chefsController);
app.use("/api/dishes", index_1.dishesController);
app.use("/api/restaurants", index_1.restaurantsController);
app.use("/api/icons", index_1.iconsController);
app.listen(configFile_1.config.PORT, async () => {
    console.log("Server is up.");
    // await connect();
});
