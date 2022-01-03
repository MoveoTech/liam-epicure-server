import { Response, Request } from "express";
import { IRestaurant, RestaurantModel } from "models/restaurant.model";
import { PopularRestaurantModel } from "models/popular-restaurant.model";
import { Types } from "mongoose";
import { DishModel } from "models/dish.model";
import { ChefModel } from "models/chef.model";
import { IconModel } from "models/icon.model";

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const result = await RestaurantModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: ChefModel.collection.name, localField: "chef", foreignField: "_id", as: "chef" })
            .unwind({ path: "$chef", preserveNullAndEmptyArrays: true })
            .lookup({
                from: DishModel.collection.name, localField: "dishes", foreignField: "_id", as: "dishes",
                pipeline: [
                    {
                        $lookup: {
                            from: IconModel.collection.name,
                            localField: "icons",
                            foreignField: "_id",
                            as: "icons"
                        }
                    }
                ]
            })
            .lookup({ from: DishModel.collection.name, localField: "signatureDish", foreignField: "_id", as: "signatureDish" })
            .unwind({ path: "$signatureDish", preserveNullAndEmptyArrays: true })

        return res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getPopularRestaurants = async (req: Request, res: Response) => {
    try {
        const popularRestaurants = await PopularRestaurantModel.aggregate()
            .match({ status: 1 })
            .lookup({
                from: RestaurantModel.collection.name, localField: "restaurant", foreignField: "_id", as: "restaurant",
                pipeline: [
                    {
                        $lookup: {
                            from: ChefModel.collection.name,
                            localField: "chef",
                            foreignField: "_id",
                            as: "chef"
                        }
                    },
                    {
                        $unwind: "$chef"
                    }
                ]
            })
            .unwind("restaurant")
            .lookup({
                from: DishModel.collection.name,
                let: { dishes: "$restaurant.dishes" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$dishes"]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "icons",
                            let: { icons: "$icons" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$icons"]
                                        }
                                    }
                                }
                            ],
                            as: "icons"
                        }
                    }
                ],
                as: "restaurant.dishes"
            })

        res.status(200).send(popularRestaurants);
    } catch (error) {
        res.status(400).send(error)
    }
}

export const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const restaurant = await RestaurantModel.findOne({ _id: new Types.ObjectId(id), status: 1 });

        restaurant
            ? res.status(200).send(restaurant)
            : res.status(400).send("Restaurant not found.");
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getRestaurantDishesById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const dishes = await RestaurantModel.aggregate()
            .match({ _id: new Types.ObjectId(id), status: 1 })
            .lookup({ from: "dishes", localField: "dishes", foreignField: "_id", as: "dishes" })
            .unwind("dishes")
            .lookup({ from: "icons", localField: "dishes.icons", foreignField: "_id", as: "dishes.icons" });
        res.send(dishes);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const postAddNewRestaurant = async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const { restaurantModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }
        console.log(restaurantModel);

        const docResult = await RestaurantModel.collection.insertOne(restaurantModel);
        res.send(docResult);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const putUpdateRestaurant = async (req: Request, res: Response) => {
    try {

        const { restaurantModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }

        const docResult = await RestaurantModel.findOneAndUpdate({ _id: restaurantModel._id, status: 1 }, restaurantModel);
        res.send(docResult || "Failed to update.");
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const objId = new Types.ObjectId(id);
        if (!objId) {
            throw new Error("Id not valid.");
        }
        const actions = [];

        // Find and set the restaurant's status to 0.
        const docResult1 = await RestaurantModel.findOneAndUpdate(
            { _id: objId, status: 1 },
            { $set: { status: 0 } });
        if (!docResult1) {
            throw new Error("Restaurant not found.");
        }
        actions.push(docResult1);

        // Find it's chef and remove the restaurant from it's restaurants list.
        const docResult2 = await ChefModel.findOneAndUpdate(
            { restaurants: objId },
            { $pull: { restaurants: objId } })
        actions.push(docResult2);

        // Set a dish's restaurant to 'null' if it is the relevant restaurant.
        const docResult3 = await DishModel.updateMany(
            { restaurant: objId },
            { $set: { restaurant: null } }
        );
        actions.push(docResult3);

        // If on the popular restaurants list - remove it.
        const docResult4 = await PopularRestaurantModel.findOneAndDelete({ restaurant: objId })
        actions.push(docResult4);

        Promise.all(actions);
        res.send({ result: true });
    } catch (error: any) {
        res.statusMessage = error.message;
        res.status(400).send(error);
    }
}

function validateAndGetModel(data: any) {
    const restaurant: IRestaurant = data;
    const restaurantModel = new RestaurantModel(restaurant);
    const error = restaurantModel.validateSync();
    return { restaurantModel, error };
}