"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRestaurant = exports.putUpdateRestaurant = exports.postAddNewRestaurant = exports.getRestaurantDishesById = exports.getRestaurantById = exports.getPopularRestaurants = exports.getAllRestaurants = void 0;
const restaurant_model_1 = require("models/restaurant.model");
const popular_restaurant_model_1 = require("models/popular-restaurant.model");
const mongoose_1 = require("mongoose");
const dish_model_1 = require("models/dish.model");
const chef_model_1 = require("models/chef.model");
const icon_model_1 = require("models/icon.model");
const getAllRestaurants = async (req, res) => {
    try {
        const result = await restaurant_model_1.RestaurantModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: chef_model_1.ChefModel.collection.name, localField: "chef", foreignField: "_id", as: "chef" })
            .unwind({ path: "$chef", preserveNullAndEmptyArrays: true })
            .lookup({
            from: dish_model_1.DishModel.collection.name, let: { dishes: "$dishes" }, as: "dishes",
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
                        from: icon_model_1.IconModel.collection.name,
                        localField: "icons",
                        foreignField: "_id",
                        as: "icons"
                    }
                }
            ]
        })
            .lookup({ from: dish_model_1.DishModel.collection.name, localField: "signatureDish", foreignField: "_id", as: "signatureDish" })
            .unwind({ path: "$signatureDish", preserveNullAndEmptyArrays: true });
        return res.send(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getAllRestaurants = getAllRestaurants;
const getPopularRestaurants = async (req, res) => {
    try {
        const popularRestaurants = await popular_restaurant_model_1.PopularRestaurantModel.aggregate()
            .match({ status: 1 })
            .lookup({
            from: restaurant_model_1.RestaurantModel.collection.name, let: { restaurant: "$restaurant" }, as: "restaurant",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$$restaurant", "$_id"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: chef_model_1.ChefModel.collection.name,
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
            from: dish_model_1.DishModel.collection.name,
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
        });
        res.status(200).send(popularRestaurants);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getPopularRestaurants = getPopularRestaurants;
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await restaurant_model_1.RestaurantModel.findOne({ _id: new mongoose_1.Types.ObjectId(id), status: 1 });
        restaurant
            ? res.status(200).send(restaurant)
            : res.status(400).send("Restaurant not found.");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getRestaurantById = getRestaurantById;
const getRestaurantDishesById = async (req, res) => {
    const { id } = req.params;
    try {
        const dishes = await restaurant_model_1.RestaurantModel.aggregate()
            .match({ _id: new mongoose_1.Types.ObjectId(id), status: 1 })
            .lookup({ from: "dishes", localField: "dishes", foreignField: "_id", as: "dishes" })
            .unwind("dishes")
            .lookup({ from: "icons", localField: "dishes.icons", foreignField: "_id", as: "dishes.icons" });
        res.send(dishes);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getRestaurantDishesById = getRestaurantDishesById;
const postAddNewRestaurant = async (req, res) => {
    try {
        console.log(req.user);
        console.log(req.body);
        const { restaurantModel, error } = validateAndGetModel(req.body);
        if (error) {
            throw new Error(error.message);
        }
        const docResult = await restaurant_model_1.RestaurantModel.collection.insertOne(restaurantModel);
        res.send(docResult);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.postAddNewRestaurant = postAddNewRestaurant;
const putUpdateRestaurant = async (req, res) => {
    try {
        const { restaurantModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }
        const docResult = await restaurant_model_1.RestaurantModel.findOneAndUpdate({ _id: restaurantModel._id, status: 1 }, restaurantModel);
        res.send(docResult || "Failed to update.");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.putUpdateRestaurant = putUpdateRestaurant;
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = new mongoose_1.Types.ObjectId(id);
        if (!objId) {
            throw new Error("Id not valid.");
        }
        const actions = [];
        // Find and set the restaurant's status to 0.
        const docResult1 = await restaurant_model_1.RestaurantModel.findOneAndUpdate({ _id: objId, status: 1 }, { $set: { status: 0 } });
        if (!docResult1) {
            throw new Error("Restaurant not found.");
        }
        actions.push(docResult1);
        // Find it's chef and remove the restaurant from it's restaurants list.
        const docResult2 = await chef_model_1.ChefModel.findOneAndUpdate({ restaurants: objId }, { $pull: { restaurants: objId } });
        actions.push(docResult2);
        // Set a dish's restaurant to 'null' if it is the relevant restaurant.
        const docResult3 = await dish_model_1.DishModel.updateMany({ restaurant: objId }, { $set: { restaurant: null } });
        actions.push(docResult3);
        // If on the popular restaurants list - remove it.
        const docResult4 = await popular_restaurant_model_1.PopularRestaurantModel.findOneAndDelete({ restaurant: objId });
        actions.push(docResult4);
        Promise.all(actions);
        res.send({ result: true });
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).send(error);
    }
};
exports.deleteRestaurant = deleteRestaurant;
function validateAndGetModel(data) {
    const restaurant = data;
    const restaurantModel = new restaurant_model_1.RestaurantModel(restaurant);
    const error = restaurantModel.validateSync();
    return { restaurantModel, error };
}
