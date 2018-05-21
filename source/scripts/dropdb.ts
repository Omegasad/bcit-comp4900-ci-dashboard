/**
 * This will drop used database tables.
 */

import { IDataStorage } from "../datastorages/IDataStorage"
import { MysqlDataStorage } from "../datastorages/MysqlDataStorage"
const config = require("../../config/config")

DropDatabase();
async function DropDatabase()
{
    const storage: IDataStorage = new MysqlDataStorage(config.db.connection);

    console.log("\n\nDropping database tables...");
    console.log("Connecting to database...");
    await storage.Initialize();

    for (let tablename of Object.keys(config.db.tablename))
    {
        try
        {
            console.log(`Dropping table if exists ${tablename}...`);
            await storage.Query(`DROP TABLE IF EXISTS ${tablename}`);
        }
        catch (err)
        {
            console.log(`ERROR DROPPING TABLE: ${tablename}`);
            throw err;
        }
    }

    console.log("Closing database connection...");
    storage.Dispose();
    console.log("Completed dropping database tables.");
}