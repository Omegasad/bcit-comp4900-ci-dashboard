import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
import { Plotly } from "../Plotly"
const config = require("../../../config/config")

/**
 * E_DaysToResolutionCriticalKpiMapper.
 * 
 * Days with no data will be ignored (not plotted).
 */
export class E_DaysToResolutionCriticalKpiMapper extends KpiMapper
{
    public readonly Title: string = "Days To Resolve Critical Bugs";

    private _yAxisTitle: string = "Days (lower is better)";

    // Target and stretch goals
    private _targetGoal: number = config.kpi.goals.bugs_resolution_time_critical.target;
    private _stretchGoal: number = config.kpi.goals.bugs_resolution_time_critical.stretch;

    /**
     * Returns an array of SQL query strings given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} an array of one or more SQL query string
     * @override
     */
    protected getQueryStrings(from: string, to: string, dateRange: number): string[]
    {
        var movingAveragePeriod: number = SimpleMovingAveragePeriod.GetPeriod(dateRange);
        var nPrevDays: number = movingAveragePeriod - 1;
        var dailyCriticalBugsResolvedSubquery: string =
        `(
            SELECT RESOLUTION_DATE
                  ,AVG(DATEDIFF(RESOLUTION_DATE, CREATION_DATE)) AS 'AVG_DAYS_TO_FIX'
            FROM ${config.db.tablename.bug_resolution_dates}
            WHERE (RESOLUTION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              AND PRIORITY = 'Critical'
            GROUP BY RESOLUTION_DATE
        )`;
        return [
            // Critical Bugs Resolved Velocity
            `
                SELECT T1.RESOLUTION_DATE AS 'DATE'
                      ,AVG(T2.AVG_DAYS_TO_FIX) AS 'AVG_VALUE'
                FROM ${dailyCriticalBugsResolvedSubquery} T1
                  LEFT JOIN ${dailyCriticalBugsResolvedSubquery} T2
                    ON T2.RESOLUTION_DATE BETWEEN
                       DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
                WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `
        ];
    }

    /**
     * Adds trace data to charts.
     * @param {string} name of trace line
     * @param {string} yaxis used by traceline: "y" or "y2"
     * @param {Array<any>} traceData to add
     * @param {Array<any>} charts containing all trace lines
     */
    private addTraceLineToChart(name: string, yaxis: string, traceData: Array<any>, charts: Array<any>) : void
    {
        // insufficient data
        if (traceData.length < 2)
        {
            return;
        }

        // generate trace line
        var traceLine: any = Plotly.GetTraceLineData
        (
            name,   // title
            [],     // empty array
            [],     // empty array
        );
        traceLine.yaxis = yaxis;

        // add trace data to trace line
        for (let record of traceData)
        {
            traceLine.x.push(record.DATE);
            traceLine.y.push(record.AVG_VALUE);
        }

        // add trace line to the main charts data
        charts.push(traceLine);
    }

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        // Invalid; Requires at least 2 data points
        if (jsonArrays[0].length < 2)
        {
            return null;
        }

        // map traces line to charts data for Plotly to consume
        var chartsData: any = [];
        this.addTraceLineToChart("Critical Bugs", "y", jsonArrays[0], chartsData);

        // Return Plotly.js consumable
        return {
            data: chartsData,
            layout: {
                title: this.Title,
                showlegend: true,
                legend: Plotly.GetLegendInfo(),
                xaxis: Plotly.GetDateXAxis(this.chartFromDate, this.chartToDate),
                yaxis: Plotly.GetYAxis(this._yAxisTitle),
                shapes: Plotly.GetShapesFromGoals(this._targetGoal, this._stretchGoal)
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}