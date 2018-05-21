/**
 * IDataStorage.
 * 
 * Allows writing data to a storage medium.
 */
export interface IDataStorage
{
    /**
     * Initialize storage medium.
     * @async
     * @returns {Promise<any>} not used
     * @throws {Error} Error if failed to initialize
     */
    Initialize(): Promise<any>;

    /**
     * Query storage returning results as JSON array.
     * @async
     * @param {string} sql query to run
     * @returns {Promise<any>} results as JSON array or JSON object
     * @throws {Error} Error if errored
     */
    Query(sql: string): Promise<any>;

    /**
     * Write one or more records to specified table in database.
     * @async
     * @param {string} tablename to write to
     * @param {Array<any>} columns column names of the table
     * @param {Array<any>} records to be inserted, can be one or more
     * @returns {Promise<boolean>} true if write successful, false otherwise
     * @throws {Error} Error if errored
     */
    Write(tablename: string, columns: Array<any>, records: Array<any>): Promise<boolean>;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}