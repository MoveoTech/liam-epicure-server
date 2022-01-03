import { Response, Request } from "express";
import { DishModel, IDish } from "models/dish.model";
import { IconModel } from "models/icon.model";
import { RestaurantModel } from "models/restaurant.model";
import { SignatureDishModel } from "models/signature-dish.model";
import { Types } from "mongoose";

export const getAllDishes = async (req: Request, res: Response) => {
    try {
        const dishes = await DishModel.aggregate()
        .match({status: 1})
        .lookup({from: RestaurantModel.collection.name, localField: "restaurant", foreignField: "_id", as: "restaurant"})
        .unwind({path: "$restaurant", preserveNullAndEmptyArrays: true})
        .lookup({from: IconModel.collection.name, localField: "icons", foreignField: "_id", as: "icons"})
        res.send(dishes);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getDishById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dish = await DishModel.findOne({ _id: new Types.ObjectId(id), status: 1 });

        res.send(dish);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getSignatureDishes = async (req: Request, res: Response) => {
    try {
        const dish = await SignatureDishModel.aggregate()
            .match({ status: 1 })
            .lookup({ from: DishModel.collection.name, localField: "dish", foreignField: "_id", as: "dish" })
            .unwind("dish")
            .lookup({ from: IconModel.collection.name, localField: "dish.icons", foreignField: "_id", as: "dish.icons" });

        res.send(dish);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const postAddNewDish = async (req: Request, res: Response) => {
    try {
        const { dishModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }

        const docResult = await DishModel.collection.insertOne(dishModel);
        res.send(docResult || "Failed to add new document.");
    } catch (error) {
        res.status(400).send(error);
    }
}

export const putUpdateDish = async (req: Request, res: Response) => {
    try {
        const { dishModel, error } = validateAndGetModel(req.body);
        if (error) {
            console.log(error);
            
            return res.status(400).send(error);
        }
        console.log(dishModel);
        
        const docResult = await DishModel.findOneAndUpdate({ _id: dishModel._id, status: 1 }, dishModel);
        res.send(docResult || "Failed to update document.");
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteDish = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const objId = new Types.ObjectId(id);
        const actions = [];

        // Change dish's status to 0
        const docResult1 = await DishModel.findOneAndUpdate(
            { _id: objId, status: 1 },
            { $set: { status: 0 } }
        );
        if (!docResult1) {
            throw new Error("Dish not found");
        }
        actions.push(docResult1);

        // Remove from the restaurant's dishes array
        const docResult2 = await RestaurantModel.findOneAndUpdate(
            { $or: [{ dishes: objId }, { signatureDish: objId }] },
            { $pull: { dishes: objId }, $set: { signatureDish: null } }
        );
        actions.push(docResult2);

        // Remove from Signature-Dishes
        const docResult3 = await SignatureDishModel.findOneAndDelete({ dish: objId });
        actions.push(docResult3);

        Promise.all(actions);
        res.send({result: true});
    } catch (error : any) {
        res.statusMessage = error.message;
        res.status(400).send(error);
    }
}

function validateAndGetModel(data: any) {
    const dish: IDish = data;
    const dishModel = new DishModel(dish);
    const error = dishModel.validateSync();
    return { dishModel, error };
}