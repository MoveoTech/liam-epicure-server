import { Request, Response } from "express";
import { DishModel } from "models/dish.model";
import { IconModel, IIcon } from "models/icon.model";
import { Types } from "mongoose";

export const getAllIcons = async (req: Request, res: Response) => {
    try {
        const icons = await IconModel.find({ status: 1 });
        res.send(icons)
    } catch (error: any) {
        res.status(500).send(error);
    }
}

export const getIconById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const icon = await IconModel.findOne({ _id: new Types.ObjectId(id), status: 1 });
        res.send(icon);
    } catch (error: any) {
        res.status(500).send(error);
    }
}

export const putUpdateIcon = async (req: Request, res: Response) => {
    try {
        const { iconModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }
        const docResult = await IconModel.findOneAndUpdate({ _id: iconModel._id, status: 1 }, iconModel);
        res.send(docResult);
    } catch (error: any) {
        res.status(500).send(error);
    }
}

export const postAddIcon = async (req: Request, res: Response) => {
    try {
        const { iconModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(500).send(error);
        }

        const docResult = await IconModel.collection.insertOne(iconModel);
        res.send(docResult);
    } catch (error: any) {
        res.status(500).send(error);
    }
}

export const deleteIcon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const objId = new Types.ObjectId(id);
        if (!objId) {
            return res.status(500).send("Id not valid.");
        }
        const actions = [];

        const docResult1 = await IconModel.findOneAndUpdate(
            { _id: objId, status: 1 },
            { $set: { status: 0 } }
        );
        actions.push(docResult1);

        const docResult2 = await DishModel.updateMany(
            { icons: objId },
            { $pull: { icons: objId } }
        );
        actions.push(docResult2);

        Promise.all(actions);

        res.send("Icon deleted successfully.");

    } catch (error: any) {
        res.status(500).send(error);
    }
}

function validateAndGetModel(body: any) {
    const icon: IIcon = body;
    const iconModel = new IconModel(icon);
    const error = iconModel.validateSync();
    return { iconModel, error };
}