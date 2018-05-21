/**
 * IDataInterface.
 * 
 * Contains data model and able to transform raw JSON object to that model.
 */
export interface IDataInterface
{
    /**
     * Table name for data set.
     */
    readonly TableName: string;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     */
    readonly TableColumns: Array<string>;

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Array order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>|null} data record as an array or null if discarding data
     */
    Transform(o: any): Array<any>|null;
}