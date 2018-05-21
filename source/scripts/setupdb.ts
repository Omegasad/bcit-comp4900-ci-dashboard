/**
 * This will set up the required database tables.
 */

import { IDataStorage } from "../datastorages/IDataStorage"
import { MysqlDataStorage } from "../datastorages/MysqlDataStorage"
const config = require("../../config/config")
const sqlqueries = require("../../config/sqlqueries")

SetupDatabase();
async function SetupDatabase()
{
    const storage: IDataStorage = new MysqlDataStorage(config.db.connection);

    console.log("\n\nSetting up database...");
    console.log("Connecting to database...");
    await storage.Initialize();

    for (let i: number = 0; i < sqlqueries.setup.length; ++i)
    {
        try
        {
            console.log(i + ". Running database query...");
            await storage.Query(sqlqueries.setup[i]);
        }
        catch (err)
        {
            console.log("ERROR RUNNING QUERY: " + sqlqueries.setup[i]);
            throw err;
        }
    }

    console.log("Closing database connection...");
    storage.Dispose();
    console.log("Completed database setup.");
}