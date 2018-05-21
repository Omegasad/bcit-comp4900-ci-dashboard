import * as moment from "moment"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * KpiMapper.
 * 
 * Maps storage data to a specific type of KPI state object that can be consumed by Plotly.js.
 */
export abstract class KpiMapper
{
    /**
     * Returns the date range given a from and to date.
     * @param {Date} from 
     * @param {Date} to 
     */
    public static GetDateRange(from: Date, to: Date): number
    {
        var fromDate: moment.Moment = moment.utc(from);
        var toDate: moment.Moment = moment.utc(to);
        return toDate.diff(fromDate, "days") + 1; // +1 cause inclusive of "toDate"
    }

    public abstract readonly Title: string;

    // Date range for Plotly to limit lower and upperbounds
    protected chartFromDate: string;
    protected chartToDate: string;

    private _dataStorage: IDataStorage;

    /**
     * Constructor.
     * @param {IDataStorage} dataStorage
     */
    public constructor(dataStorage: IDataStorage)
    {
        this._dataStorage = dataStorage;
    }

    /**
     * Returns a KPI state object that can be consumed by Plotly.js, or null when insufficient or no data.
     * @async
     * @param {Date} from date
     * @param {Date} to date
     * @returns {Promise<IKpiState|null>} IKpiState or null when insufficient or no data
     * @throws {Error} Error if storage error
     */
    public async GetKpiStateOrNull(from: Date, to: Date): Promise<IKpiState|null>
    {
        var fromDate: moment.Moment = moment.utc(from);
        var toDate: moment.Moment = moment.utc(to);

        this.chartFromDate = fromDate.format(config.dateformat.charts);
        this.chartToDate = toDate.format(config.dateformat.charts);

        var sqls: string[] = this.getQueryStrings
        (
            // -1 day to fromDate to fix Plotly indentation issues
            fromDate.subtract(2, "day").format(config.dateformat.mysql),
            toDate.format(config.dateformat.mysql),
            KpiMapper.GetDateRange(from, to)
        );

        try
        {
            var jsonArrayResults: Array<any>[] = [];
            for (let sql of sqls)
            {
                jsonArrayResults.push(await this._dataStorage.Query(sql));
            }
            return this.mapToKpiStateOrNull(jsonArrayResults);
        }
        catch (err)
        {
            throw err;
        }
    }

    /**
     * Returns an array of SQL query strings given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} an array of one or more SQL query string
     */
    protected abstract getQueryStrings(from: string, to: string, dateRange: number): string[];

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected abstract mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null;
}