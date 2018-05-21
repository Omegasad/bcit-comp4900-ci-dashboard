import * as mysql from "mysql"
import { IDataStorage } from "./IDataStorage"

/**
 * MysqlDataStorage.
 * 
 * Allows writing data to a MySQL database.
 */
export class MysqlDataStorage implements IDataStorage
{
    /**
     * If true, any new records with an existing primary key in database will be replaced.
     */
    private readonly _REPLACE_EXISTING_RECORDS = true;

    /**
     * Node.js MySQL connector requires insert statements with separate values parameter
     * be wrapped with this many array layers.
     */
    private readonly _REQUIRED_VALUES_ARRAY_LAYER_COUNT: number = 3;

    private _connection: mysql.Connection;

    /**
     * Constructor.
     * @param {mysql.ConnectionConfig} connectionConfig containing database and credentials
     */
    public constructor(connectionConfig: mysql.ConnectionConfig)
    {
        this._connection = mysql.createConnection(connectionConfig);
    }

    /**
     * Connect to database.
     * @async
     * @returns {Promise<any>} not used
     * @throws {MySQL.MysqlError} MysqlError if failed to connect
     * @override
     */
    public async Initialize(): Promise<any>
    {
        var _this: MysqlDataStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.connect((error: mysql.MysqlError) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve();
                }
            });
        });
    }

    /**
     * Query MySQL returning results as JSON array.
     * @async
     * @param {string} sql query to run
     * @param {Array<any>} [records] for insert queries only
     * @returns {Promise<any>} results as JSON array or JSON object
     * @throws {Error} Error if errored
     * @override
     */
    public async Query(sql: string, records?: Array<any>): Promise<any>
    {
        var _this: MysqlDataStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.query(sql, records, (err: mysql.MysqlError, results: Array<object>|object) =>
            {
                if (err)
                {
                    err.message += `\nSQL Query: ${sql}\nInsert Data: ${records}\n`;
                    reject(err);
                }
                else
                {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Write one or more records to specified table in database.
     * @async
     * @param {string} tablename to write to
     * @param {Array<any>} columns column names of the table
     * @param {Array<any>} records to be inserted, can be one or more
     * @returns {Promise<boolean>} true if write successful, false otherwise
     * @throws {Error} Error if errored
     */
    public async Write(tablename: string, columns: Array<any>, records: Array<any>): Promise<boolean>
    {
        var insertQuery: string = this.getInsertQuery(tablename, columns);
        var insertRecords: Array<any> = this.wrapInsertRecordsArray(records);
        var results: any;
        try
        {
            results = await this.Query(insertQuery, insertRecords);
        }
        catch (err)
        {
            throw err;
        }
        return (results.affectedRows != 0);
    }

    /**
     * End connection.
     * @override
     */
    public Dispose(): void
    {
        this._connection.end();
    }

    /**
     * Return an insert query for prepared statements.
     * @param {string} tablename to insert to
     * @param {string[]} columns in table
     */
    private getInsertQuery(tablename: string, columns: string[]): string
    {
        var insertOrReplace: string = (this._REPLACE_EXISTING_RECORDS)
            ? "REPLACE"
            : "INSERT";
        var query: string = `${insertOrReplace} INTO ${tablename} (`;
        for (let i: number = 0; i < columns.length; ++i)
        {
            query += columns[i] + ",";
        }
        query = query.slice(0, -1); // remove last comma
        query += ") VALUES ?";
        return query;
    }

    /**
     * Wraps insert records with a predefined number of arrays.
     * Required for MySQL connector query() function.
     * @param {Array<any>} records to be wrapped, can be one or more
     */
    private wrapInsertRecordsArray(records: Array<any>): Array<any>
    {
        var arrayLayersCount: number = 1;
        var traverse: Array<any> = records;
        while (Array.isArray(traverse[0]))
        {
            traverse = traverse[0];
            ++arrayLayersCount;
        }
        while (++arrayLayersCount <= this._REQUIRED_VALUES_ARRAY_LAYER_COUNT)
        {
            records = [records];
        }
        return records;
    }
}