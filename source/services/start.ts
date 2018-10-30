import { IDataStorage } from "../datastorages/IDataStorage"
import { MysqlDataStorage } from "../datastorages/MysqlDataStorage"

import { start_webserver } from "./start_webserver"
import { start_scheduler } from "./start_scheduler"
const config = require("../../config/config")

startservices();
async function startservices()
{
    console.log("Starting services...");
    const storage: IDataStorage = new MysqlDataStorage(config.db.connection);
    await storage.Initialize();
    start_webserver(storage);
    // start_scheduler(storage);
}