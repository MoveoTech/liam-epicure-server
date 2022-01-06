import express, { Express } from "express";
// import { connect } from "./middlewares/dbConnect";
import { chefsController, restaurantsController, dishesController, iconsController, usersController } from "controllers/index";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "configFile";
const app: Express = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Parses body objects as JSON
app.use(bodyParser.urlencoded({ extended: false }));// make sure url params are of type string / array.

// Controllers
app.use("/api/users", usersController);
app.use("/api/chefs", chefsController);
app.use("/api/dishes", dishesController);
app.use("/api/restaurants", restaurantsController);
app.use("/api/icons", iconsController);

app.listen(config.PORT, async () => {
    console.log("Server is up.");
    // await connect();
});