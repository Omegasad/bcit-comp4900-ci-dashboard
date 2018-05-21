import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
import { Plotly } from "../Plotly"
const config = require("../../../config/config")

/**
 * A_StoryPointsVelocityKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class A_StoryPointsVelocityKpiMapper extends KpiMapper
{
    public readonly Title: string = "Story Points Velocity";

    private _yAxisTitle: string = "Points per day (higher is better)";

    // Target and stretch goals
    private _targetGoal: number = config.kpi.goals.story_points_velocity.target_annual/365;
    private _stretchGoal: number = config.kpi.goals.story_points_velocity.stretch_annual/365;

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
        var dailyAvgStoryPointsSubquery: string =
        `(
            SELECT RESOLUTION_DATE
                  ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
            FROM ${config.db.tablename.resolved_story_points}
            WHERE RESOLUTION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
            GROUP BY RESOLUTION_DATE
        )`;
        return [`
            SELECT D1.DATE AS 'DATE'
                  ,IFNULL(SUM(T2.AVG_STORY_POINTS), 0)/${movingAveragePeriod} AS 'AVG_STORY_POINTS'
            FROM ${generateDatesSubquery} D1
              LEFT JOIN ${dailyAvgStoryPointsSubquery} T1
                ON T1.RESOLUTION_DATE = D1.DATE
              LEFT JOIN ${dailyAvgStoryPointsSubquery} T2
                ON T2.RESOLUTION_DATE BETWEEN
                   DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
            WHERE D1.DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE
            ORDER BY DATE ASC
        `];
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

        // generate trace line
        var traceLine: any = Plotly.GetTraceLineData
        (
            "Story Points", // title
            [],             // empty array
            [],             // empty array
        );

        // add x, y values to trace line
        for (let result of jsonArrays[0])
        {
            traceLine.x.push(result.DATE);
            traceLine.y.push(result.AVG_STORY_POINTS);
        }

        // Return Plotly.js consumable
        return {
            data: [traceLine],
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