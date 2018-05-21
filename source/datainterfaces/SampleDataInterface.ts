import { IDataInterface } from "./IDataInterface"
const config = require("../../config/config");

/**
 * SampleDataInterface.
 */
export class SampleDataInterface implements IDataInterface
{
    /**
     * Table name for data set.
     * @override
     */
    public readonly TableName: string = config.db.tablename.sample_data;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     * @override
     */
    public readonly TableColumns: Array<string> =
    [
        "ID"
    ];

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Array order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>|null} data record as an array or null if discarding data
     * @override
     */
    public Transform(o: any): Array<any>|null
    {
        // object has both a key and a value
        // value is the json object
        o = o.value;

        if (o.iteration_num == 1)
        {
            // throw error and see if it crashes
            // throw new Error("test throw error");

            // do not save object to database
            return null;
        }

        return [
            o.iteration_num // ID
        ];
    }
}