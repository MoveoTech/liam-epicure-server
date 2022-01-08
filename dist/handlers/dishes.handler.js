"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.putUpdateDish = exports.postAddNewDish = exports.putSignatureDishes = exports.getSignatureDishes = exports.getDishById = exports.getAllDishes = void 0;
const dish_model_1 = require("../models/dish.model");
const icon_model_1 = require("../models/icon.model");
const restaurant_model_1 = require("../models/restaurant.model");
const signature_dish_model_1 = require("../models/signature-dish.model");
const mongoose_1 = require("mongoose");
const getAllDishes = async (req, res) => {
    try {
        const dishes = await dish_model_1.DishModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: restaurant_model_1.RestaurantModel.collection.name, localField: "restaurant", foreignField: "_id", as: "restaurant" })
            .unwind({ path: "$restaurant", preserveNullAndEmptyArrays: true })
            .lookup({ from: icon_model_1.IconModel.collection.name, localField: "icons", foreignField: "_id", as: "icons" });
        res.send(dishes);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getAllDishes = getAllDishes;
const getDishById = async (req, res) => {
    try {
        const { id } = req.params;
        const dish = await dish_model_1.DishModel.findOne({ _id: new mongoose_1.Types.ObjectId(id), status: 1 });
        res.send(dish);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getDishById = getDishById;
const getSignatureDishes = async (req, res) => {
    try {
        const dish = await signature_dish_model_1.SignatureDishModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: dish_model_1.DishModel.collection.name, localField: "dish", foreignField: "_id", as: "dish" })
            .unwind("dish")
            .lookup({ from: icon_model_1.IconModel.collection.name, localField: "dish.icons", foreignField: "_id", as: "dish.icons" });
        res.send(dish);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getSignatureDishes = getSignatureDishes;
const putSignatureDishes = async (req, res) => {
    try {
        const dishObjs = req.body;
        // Verify body data and return an IRestaurant interface.
        const dishes = dishObjs.map((dish) => {
            const { error } = validateAndGetModel(dish);
            if (error) {
                throw new Error(error.message);
            }
            return dish;
        });
        // Convert IDish interfaces to a SignatureDishModel
        const signatureDishModels = dishes.map((dish) => {
            return new signature_dish_model_1.SignatureDishModel({ dish, status: 1 });
        });
        // Delete all existing popular restaurants
        const deleteResult = await signature_dish_model_1.SignatureDishModel.deleteMany();
        if (!deleteResult) {
            throw new Error("Couldn't delete popular restaurants.");
        }
        // Insert new restaurants
        const insertResult = await signature_dish_model_1.SignatureDishModel.insertMany(signatureDishModels);
        if (!insertResult) {
            throw new Error("Couldn't insert new popular restaurants");
        }
        res.status(200).send(insertResult);
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).send(error);
    }
};
exports.putSignatureDishes = putSignatureDishes;
const postAddNewDish = async (req, res) => {
    try {
        const { dishModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }
        const docResult = await dish_model_1.DishModel.collection.insertOne(dishModel);
        res.send(docResult || "Failed to add new document.");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.postAddNewDish = postAddNewDish;
const putUpdateDish = async (req, res) => {
    try {
        const { dishModel, error } = validateAndGetModel(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        }
        console.log(dishModel);
        const docResult = await dish_model_1.DishModel.findOneAndUpdate({ _id: dishModel._id, status: 1 }, dishModel);
        res.send(docResult || "Failed to update document.");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.putUpdateDish = putUpdateDish;
const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = new mongoose_1.Types.ObjectId(id);
        const actions = [];
        // Change dish's status to 0
        const docResult1 = await dish_model_1.DishModel.findOneAndUpdate({ _id: objId, status: 1 }, { $set: { status: 0 } });
        if (!docResult1) {
            throw new Error("Dish not found");
        }
        actions.push(docResult1);
        // Remove from the restaurant's dishes array
        const docResult2 = await restaurant_model_1.RestaurantModel.findOneAndUpdate({ $or: [{ dishes: objId }, { signatureDish: objId }] }, { $pull: { dishes: objId }, $set: { signatureDish: null } });
        actions.push(docResult2);
        // Remove from Signature-Dishes
        const docResult3 = await signature_dish_model_1.SignatureDishModel.findOneAndDelete({ dish: objId });
        actions.push(docResult3);
        Promise.all(actions);
        res.send({ result: true });
    }
    catch (error) {
        res.statusMessage = error.message;
        res.status(500).send(error);
    }
};
exports.deleteDish = deleteDish;
function validateAndGetModel(data) {
    const dish = data;
    const dishModel = new dish_model_1.DishModel(dish);
    const error = dishModel.validateSync();
    return { dishModel, error };
}
