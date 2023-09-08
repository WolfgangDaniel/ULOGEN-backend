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

  getSpecificBotModels = async (req: Request, res: Response): Promise<void | any> => {
    try {
      const botModelIds: string[] = Array.isArray(req.query.BotModelIds)
        ? req.query.BotModelIds.map(String)
        : [String(req.query.BotModelIds || '')];
  
      if (botModelIds.length === 0) {
        return BaseController.notFound(res);
      }
  
      const botModels: any[] = [];
  
      for (const botModelId of botModelIds) {
        const botModel = await BotModel.findById(botModelId);
  
        if (!botModel) {
          return BaseController.notFound(res);
        }
  
        if (req.query.type) {
          const botLinkerContext: BotLinkerContext = new BotLinkerContext(
            req.query.type.toString()
          );
          const linkedBotModel = botLinkerContext.linkBot(botModel);
  
          // Save the linkedBotModel to a JSON file with a unique name
          const jsonFilePath = `linkedBotModel_${botModelId}.json`;
          fs.writeFileSync(jsonFilePath, JSON.stringify(linkedBotModel, null, 2));
  
          botModels.push(JSON.stringify(linkedBotModel));
        } else {
          // Save the botModel to a JSON file with a unique name
          const jsonFilePath = `botModel_${botModelId}.json`;
          fs.writeFileSync(jsonFilePath, JSON.stringify(botModel.toJSON(), null, 2));
  
          // Push the document instance, not the model
          botModels.push(JSON.stringify(botModel));
        }
      }
  
      res.send(botModels);
    } catch (error) {
      return BaseController.fail(res, error);
    }
  };
  
  //In this code, I've changed the botModels array to hold document instances (botModel) rather than model instances. This should resolve the type error you encountered.
  
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
