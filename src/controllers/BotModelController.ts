import { Request, Response } from "express";
import BotModel from "../models/BotModel";
import BaseController from "../controllers/BaseController";
import BotLinkerContext from "../botLinkers/botLinkerContext";
import fs from 'fs';

class BotModelController extends BaseController {
  getBotModels = async (req: Request, res: Response): Promise<void | any> => {
    const botModels = await BotModel.find({});

    try {
      res.send(botModels);
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };

  getBotModel = async (req: Request, res: Response): Promise<void | any> => {
    try {
      const botModel = await BotModel.findById(req.params.BotModelId);

      if (!botModel) {
        return BaseController.notFound(res);
      }

      if (req.query.type) {
        const botLinkerContext: BotLinkerContext = new BotLinkerContext(
          req.query.type.toString()
        );
        res.send(botLinkerContext.linkBot(botModel));
      } else {
        // print out bot model to better understand the data that is stored
        const jsonFilePath = 'botModel.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(botModel, null, 2));
        
        res.send(botModel);
      }
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };

  createBotModel = async (req: Request, res: Response): Promise<void | any> => {
    const newBot = new BotModel(req.body);

    try {
      await newBot.save();
      res.send(newBot);
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };

  updateBotModel = async (req: Request, res: Response): Promise<void | any> => {
    try {
      const updatedBotModel = await BotModel.findByIdAndUpdate(
        req.params.BotModelId,
        req.body
      );
      res.send(updatedBotModel);
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };

  deleteBotModel = async (req: Request, res: Response): Promise<void | any> => {
    try {
      const deletedBotModel = await BotModel.findByIdAndDelete(
        req.params.BotModelId
      );

      if (!deletedBotModel) {
        res.status(404).send("No item found");
      }
      res.status(200).send();
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };
}

export default new BotModelController();
