import express, { Express } from "express";
import { connect } from "./middlewares/dbConnect";
import {chefsRoute, restaurantsRoute, dishesRoute} from "routes/index";

const app: Express = express();

app.use("/api/chefs", chefsRoute);
app.use("/api/dishes", dishesRoute);
app.use("/api/restaurants", restaurantsRoute);

app.listen(5000, async () => {
    console.log("Server is up.");
    await connect();
});