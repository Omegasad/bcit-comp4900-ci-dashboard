import * as moment from "moment"
import { IDataInterface } from "./IDataInterface"
const config = require("../../config/config");

/**
 * BugResolutionDatesDataInterface.
 */
export class BugResolutionDatesDataInterface implements IDataInterface
{
    /**
     * Table name for data set.
     * @override
     */
    public readonly TableName: string = config.db.tablename.bug_resolution_dates;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     * @override
     */
    public readonly TableColumns: Array<string> =
    [
        "BUG_ID",
        "PRIORITY",
        "CREATION_DATE",
        "RESOLUTION_DATE"
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
        var resolutionDate: any = (o.value.resolution_date)
            ? moment(o.value.resolution_date).format(config.dateformat.mysql)
            : null;

        return [
            o.key,                  // BUG_ID
            o.value.priority,       // PRIORITY
            moment(o.value.creation_date).format(config.dateformat.mysql),  // CREATION_DATE
            resolutionDate          // RESOLUTION_DATE
        ];
    }
}