import { Request, Response } from "express";
import { ChefModel, IChef } from "models/chef.model";
import { DishModel } from "models/dish.model";
import { IconModel } from "models/icon.model";
import { RestaurantModel } from "models/restaurant.model";
import { WeeklyChefModel } from "models/weekly-chef.model";
import { Types } from "mongoose";

export const getAllChefs = async (req: Request, res: Response) => {
    try {
        const chefs = await ChefModel.aggregate()
        .match({status: 1})
        .lookup({from: RestaurantModel.collection.name, localField: "restaurants", foreignField: "_id", as: "restaurants"});
        res.send(chefs)
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getChefById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const chef = await ChefModel.aggregate()
            .match({ _id: new Types.ObjectId(id), status: 1 })
            .lookup({
                from: RestaurantModel.collection.name,
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
                            from: DishModel.collection.name,
                            localField: "signatureDish",
                            foreignField: "_id",
                            as: "signatureDish"
                        }
                    },
                    {
                        $lookup: {
                            from: DishModel.collection.name,
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
                                        from: IconModel.collection.name,
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
            })
        res.send(chef)
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getWeeklyChef = async (req: Request, res: Response) => {
    try {
        const chef = await WeeklyChefModel.aggregate()
            .lookup({ from: ChefModel.collection.name, localField: "chef", foreignField: "_id", as: "chef" })
            .match({ status: 1 })
            .unwind("chef")
            .lookup({
                from: "restaurants", localField: "chef.restaurants", foreignField: "_id", as: "chef.restaurants",
                pipeline: [{ $unset: ["chef", "dishes", "signatureDish"] }]
            })
        res.send(chef);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const postAddNewChef = async (req: Request, res: Response) => {
    try {
        const { chefModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }

        const docResult = await ChefModel.collection.insertOne(chefModel);
        res.send(docResult);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const putUpdateChef = async (req: Request, res: Response) => {
    try {
        const { chefModel, error } = validateAndGetModel(req.body);
        if (error) {
            return res.status(400).send(error);
        }

        const docResult = await ChefModel.findOneAndUpdate({ _id: chefModel._id, status: 1 }, chefModel);
        res.send(docResult);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteChef = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const objId = new Types.ObjectId(id);
        if(!objId){
            throw new Error("Id not valid.");
        }
        const actions = [];

        // Set chef's status to 0.
        const docResult1 = await ChefModel.findOneAndUpdate(
            { _id: objId, status: 1 },
            { $set: { status: 0 } }
        );

        if(!docResult1){
            throw new Error("Chef not found");
        }
        actions.push(docResult1);

        // Find and update all relevant restaurants.
        const docResult2 = await RestaurantModel.updateMany(
            { chef: objId },
            { $set: { chef: null } }
        );
        actions.push(docResult2);

        // If found on weekly chef - remove it from there.
        const docResult3 = await WeeklyChefModel.findOneAndDelete({ _id: objId });
        actions.push(docResult3);

        Promise.all(actions);
        res.send({result: true});
    } catch (error : any) {
        res.statusMessage = error.message;
        res.status(400).send(error);
    }
}

function validateAndGetModel(data: any) {
    const chef: IChef = data;
    const chefModel = new ChefModel(chef);
    const error = chefModel.validateSync();
    return { chefModel, error };
}