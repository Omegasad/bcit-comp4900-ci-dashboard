import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
import { Plotly } from "../Plotly"
const config = require("../../../config/config")

/**
 * B_BugCreationVelocityKpiMapper.
 * 
 * Days with no data will assumed to be zero.
 */
export class B_BugCreationVelocityKpiMapper extends KpiMapper
{
    public readonly Title: string = "Bug Creation Velocity";

    private _yAxisTitle: string = "Bugs created per day (lower is better)";

    // Target and stretch goals
    private _targetGoal: number = config.kpi.goals.bugs_per_day.target;
    private _stretchGoal: number = config.kpi.goals.bugs_per_day.stretch;

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
        var generateDatesSubquery: string = GenerateDatesSubquery.GetQuery(from, to);
        var dailyMajorBugsCreatedSubquery: string =
        `(
            SELECT CREATION_DATE
                  ,COUNT(*) AS 'BUGS_CREATED'
            FROM ${config.db.tablename.bug_resolution_dates}
            WHERE (CREATION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              AND PRIORITY = 'Major'
            GROUP BY CREATION_DATE
        )`;
        var dailyCriticalBugsCreatedSubquery: string =
        `(
            SELECT CREATION_DATE
                  ,COUNT(*) AS 'BUGS_CREATED'
            FROM ${config.db.tablename.bug_resolution_dates}
            WHERE (CREATION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              AND PRIORITY = 'Critical'
            GROUP BY CREATION_DATE
        )`;
        return [
            // Major Bugs Resolved Velocity
            `
                SELECT D1.DATE AS 'DATE'
                      ,IFNULL(SUM(T2.BUGS_CREATED), 0)/${movingAveragePeriod} AS 'AVG_VALUE'
                FROM ${generateDatesSubquery} D1
                  LEFT JOIN ${dailyMajorBugsCreatedSubquery} T1
                    ON T1.CREATION_DATE = D1.DATE
                  LEFT JOIN ${dailyMajorBugsCreatedSubquery} T2
                    ON T2.CREATION_DATE BETWEEN
                       DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
                WHERE D1.DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `,
            // Critical Bugs Resolved Velocity
            `
                SELECT D1.DATE AS 'DATE'
                      ,IFNULL(SUM(T2.BUGS_CREATED), 0)/${movingAveragePeriod} AS 'AVG_VALUE'
                FROM ${generateDatesSubquery} D1
                  LEFT JOIN ${dailyCriticalBugsCreatedSubquery} T1
                    ON T1.CREATION_DATE = D1.DATE
                  LEFT JOIN ${dailyCriticalBugsCreatedSubquery} T2
                    ON T2.CREATION_DATE BETWEEN
                       DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
                WHERE D1.DATE BETWEEN '${from}' AND '${to}'
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
        if (jsonArrays[0].length < 2 && jsonArrays[1].length < 2)
        {
            return null;
        }

        // map traces line to charts data for Plotly to consume
        var chartsData: any = [];
        this.addTraceLineToChart("Major Bugs", "y", jsonArrays[0], chartsData);
        this.addTraceLineToChart("Critical Bugs", "y", jsonArrays[1], chartsData);

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