"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChef = exports.putUpdateChef = exports.postAddNewChef = exports.putWeeklyChef = exports.getWeeklyChef = exports.getChefById = exports.getAllChefs = void 0;
const chef_model_1 = require("../models/chef.model");
const dish_model_1 = require("../models/dish.model");
const icon_model_1 = require("../models/icon.model");
const restaurant_model_1 = require("../models/restaurant.model");
const weekly_chef_model_1 = require("../models/weekly-chef.model");
const mongoose_1 = require("mongoose");
const getAllChefs = async (req, res) => {
    try {
        const chefs = await chef_model_1.ChefModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: restaurant_model_1.RestaurantModel.collection.name, localField: "restaurants", foreignField: "_id", as: "restaurants" });
        res.send(chefs);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getAllChefs = getAllChefs;
const getChefById = async (req, res) => {
    try {
        const { id } = req.params;
        const chef = await chef_model_1.ChefModel.aggregate()
            .match({ _id: new mongoose_1.Types.ObjectId(id), status: 1 })
            .lookup({
            from: restaurant_model_1.RestaurantModel.collection.name,
            let: { restaurants: "$restaurants" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$_id", "$$restaurants"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: dish_model_1.DishModel.collection.name,
                        localField: "signatureDish",
                        foreignField: "_id",
                        as: "signatureDish",
                    }
                },
                {
                    $lookup: {
                        from: dish_model_1.DishModel.collection.name,
                        let: { dishes: "$dishes" },
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
                        ],
                        as: "dishes"
                    }
                }
            ],
            as: "restaurants"
        });
        res.send(chef);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getChefById = getChefById;
const getWeeklyChef = async (req, res) => {
    try {
        const chef = await weekly_chef_model_1.WeeklyChefModel.aggregate()
            .match({ status: 1 })
            .lookup({
            from: chef_model_1.ChefModel.collection.name,
            let: { chef: "$chef" },
            as: "chef",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$$chef", "$_id"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: restaurant_model_1.RestaurantModel.collection.name,
                        localField: "restaurants",
                        foreignField: "_id",
                        as: "restaurants"
                    }
                }
            ]
        })
            .unwind("chef");
        res.send(chef);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getWeeklyChef = getWeeklyChef;
const putWeeklyChef = async (req, res) => {
    try {
        console.log(req.body);
        const chefObj = req.body;
        const { error } = validateAndGetModel(chefObj);
        if (error) {
            throw new Error(error.message);
        }
        // Create a new Weekly Chef object.
        const chefModel = new weekly_chef_model_1.WeeklyChefModel({ chef: chefObj, status: 1 });
        // Delete and check results.
        const deleteResult = await weekly_chef_model_1.WeeklyChefModel.deleteMany();
        if (!deleteResult) {
            throw new Error("Couldn't delete weekly chefs.");
        }
        // Insert new chef and check results.
        const insertResult = await weekly_chef_model_1.WeeklyChefModel.insertMany(chefModel);
        if (!insertResult) {
            throw new Error("Couldn't insert weekly chefs.");
        }
        res.send(insertResult);
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).send(error);
    }
};
exports.putWeeklyChef = putWeeklyChef;
const postAddNewChef = async (req, res) => {
    try {
        const { chefModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }
        const docResult = await chef_model_1.ChefModel.collection.insertOne(chefModel);
        res.send(docResult);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.postAddNewChef = postAddNewChef;
const putUpdateChef = async (req, res) => {
    try {
        const { chefModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }
        const docResult = await chef_model_1.ChefModel.findOneAndUpdate({ _id: chefModel._id, status: 1 }, chefModel);
        res.send(docResult);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.putUpdateChef = putUpdateChef;
const deleteChef = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = new mongoose_1.Types.ObjectId(id);
        if (!objId) {
            throw new Error("Id not valid.");
        }
        const actions = [];
        // Set chef's status to 0.
        const docResult1 = await chef_model_1.ChefModel.findOneAndUpdate({ _id: objId, status: 1 }, { $set: { status: 0 } });
        if (!docResult1) {
            throw new Error("Chef not found");
        }
        actions.push(docResult1);
        // Find and update all relevant restaurants.
        const docResult2 = await restaurant_model_1.RestaurantModel.updateMany({ chef: objId }, { $set: { chef: null } });
        actions.push(docResult2);
        // If found on weekly chef - remove it from there.
        const docResult3 = await weekly_chef_model_1.WeeklyChefModel.findOneAndDelete({ _id: objId });
        actions.push(docResult3);
        Promise.all(actions);
        res.send({ result: true });
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).send(error);
    }
};
exports.deleteChef = deleteChef;
function validateAndGetModel(data) {
    const chef = data;
    const chefModel = new chef_model_1.ChefModel(chef);
    const error = chefModel.validateSync();
    return { chefModel, error };
}
