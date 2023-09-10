import express from "express";
import BotModelController from "../controllers/BotModelController";

const router: express.Router = express.Router();

/**
 * Get all BotModels
 */
router.get("/", BotModelController.getBotModels);

/**
 * Get specified BotModels
 */
 router.get("/generateUiLogs", BotModelController.generateUiLogs);


/**
 * Get a BotModel
 */
router.get("/:BotModelId", BotModelController.getBotModel);

/**
 * Create a new BotModel
 */
router.post("/", BotModelController.createBotModel);

/**
 * Update a BotModel
 */
router.patch("/:BotModelId", BotModelController.updateBotModel);

/**
 * Delete a BotModel
 */
router.delete("/:BotModelId", BotModelController.deleteBotModel);

export default router;
