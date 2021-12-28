import express, { Express } from "express";
import { connect } from "./middlewares/dbConnect";
import { chefsController, restaurantsController, dishesController } from "controllers/index";
import cors from "cors";
import bodyParser from "body-parser";
const app: Express = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Parses body objects as JSON
app.use(bodyParser.urlencoded({ extended: false }));// make sure url params are of type string / array.

// Controllers
app.use("/api/chefs", chefsController);
app.use("/api/dishes", dishesController);
app.use("/api/restaurants", restaurantsController);

app.listen(5000, async () => {
    console.log("Server is up.");
    await connect();
});