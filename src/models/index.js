import initModels from "./init-models.js";
import { sequelize } from "../config/databaseConfigSq.js";

const models = initModels(sequelize);

export default models;