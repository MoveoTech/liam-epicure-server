"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIcon = exports.postAddIcon = exports.putUpdateIcon = exports.getIconById = exports.getAllIcons = void 0;
const dish_model_1 = require("../models/dish.model");
const icon_model_1 = require("../models/icon.model");
const mongoose_1 = require("mongoose");
const getAllIcons = async (req, res) => {
    try {
        const icons = await icon_model_1.IconModel.find({ status: 1 });
        res.send(icons);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getAllIcons = getAllIcons;
const getIconById = async (req, res) => {
    try {
        const { id } = req.params;
        const icon = await icon_model_1.IconModel.findOne({ _id: new mongoose_1.Types.ObjectId(id), status: 1 });
        res.send(icon);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getIconById = getIconById;
const putUpdateIcon = async (req, res) => {
    try {
        const { iconModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }
        const docResult = await icon_model_1.IconModel.findOneAndUpdate({ _id: iconModel._id, status: 1 }, iconModel);
        res.send(docResult);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.putUpdateIcon = putUpdateIcon;
const postAddIcon = async (req, res) => {
    try {
        const { iconModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }
        const docResult = await icon_model_1.IconModel.collection.insertOne(iconModel);
        res.send(docResult);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.postAddIcon = postAddIcon;
const deleteIcon = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = new mongoose_1.Types.ObjectId(id);
        if (!objId) {
            return res.status(500).send("Id not valid.");
        }
        const actions = [];
        const docResult1 = await icon_model_1.IconModel.findOneAndUpdate({ _id: objId, status: 1 }, { $set: { status: 0 } });
        actions.push(docResult1);
        const docResult2 = await dish_model_1.DishModel.updateMany({ icons: objId }, { $pull: { icons: objId } });
        actions.push(docResult2);
        Promise.all(actions);
        res.send("Icon deleted successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.deleteIcon = deleteIcon;
function validateAndGetModel(body) {
    const icon = body;
    const iconModel = new icon_model_1.IconModel(icon);
    const error = iconModel.validateSync();
    return { iconModel, error };
}
