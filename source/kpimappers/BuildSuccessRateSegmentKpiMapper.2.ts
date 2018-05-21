import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
import { SmoothMovingAverage } from "./SmoothMovingAverage"
const config = require("../../config/config")

/**
 * BuildSuccessRateSegmentKpiMapper with smooth moving average.
 * 
 * Days with no data will not be plotted (ignored).
 * 
 *      WARNING:
 * 
 *      This has been deprecated. The "AllBuilds" line shows overall
 *      averages for every single existing build, but not local to to
 *      data set the chart is suppose to be showing.
 */
export abstract class BuildSuccessRateSegmentKpiMapper extends KpiMapper
{
    protected abstract groupByColumn: string;
    protected abstract filterColumn: string;
    protected abstract filterValue: string;

    // Moving average of n days
    private _nDaysMovingAverage: number = 30;

    private _target: number = config.kpi.goals.build_success_rate.target_rate;
    private _stretchGoal: number = config.kpi.goals.build_success_rate.stretch_rate;

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
        var nPrevDays: number = this._nDaysMovingAverage - 1;
        var segmentQuery: string = (!this.filterColumn || !this.filterValue)
            ? ""
            : `AND ${this.filterColumn} = ${this.filterValue}`;
        return [
            // Overall
            `
                SELECT T1.BUILD_DATE AS 'BUILD_DATE'
                      ,COUNT(T2.AVG_SUCCESS_RATE) AS 'N_DAYS'
                      ,SUM(T2.AVG_SUCCESS_RATE) AS 'SUM_N_DAYS_SUCCESS_RATE'
                      ,T1.AVG_SUCCESS_RATE AS 'DAILY_SUCCESS_RATE'
                FROM (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY BUILD_DATE
                ) T1
                  LEFT JOIN (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY BUILD_DATE
                ) T2
                    ON T2.BUILD_DATE BETWEEN
                       DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY BUILD_DATE, DAILY_SUCCESS_RATE
                ORDER BY BUILD_DATE ASC
                ;
            `,
            // Segment split by this.groupByColumn
            `
                SELECT T1.BUILD_DATE AS 'BUILD_DATE'
                      ,COUNT(T2.AVG_SUCCESS_RATE) AS 'N_DAYS'
                      ,SUM(T2.AVG_SUCCESS_RATE) AS 'SUM_N_DAYS_SUCCESS_RATE'
                      ,T1.AVG_SUCCESS_RATE AS 'DAILY_SUCCESS_RATE'
                      ,T1.${this.groupByColumn} AS '${this.groupByColumn}'
                FROM (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                          ,${this.groupByColumn}
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE (BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
                          ${segmentQuery}
                    GROUP BY BUILD_DATE, ${this.groupByColumn}
                ) T1
                  LEFT JOIN (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                          ,${this.groupByColumn}
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE (BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
                          ${segmentQuery}
                    GROUP BY BUILD_DATE, ${this.groupByColumn}
                ) T2
                    ON
                    (
                        T2.BUILD_DATE BETWEEN
                        DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                    )
                    AND
                    (
                        T2.${this.groupByColumn} = T1.${this.groupByColumn}
                    )
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY BUILD_DATE, ${this.groupByColumn}
                ORDER BY ${this.groupByColumn} ASC, BUILD_DATE ASC
                ;
            `
        ];
        // return [
        //     // Overall
        //     `
        //         WITH DAILY_AVG_SUCCESS_RATE AS
        //         (
        //             SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
        //                   ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
        //             FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        //             WHERE BUILD_COMPLETED_DATE BETWEEN
        //                   DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //             GROUP BY BUILD_DATE
        //         )
        //         SELECT T1.BUILD_DATE AS 'BUILD_DATE'
        //               ,COUNT(T2.AVG_SUCCESS_RATE) AS 'N_DAYS'
        //               ,SUM(T2.AVG_SUCCESS_RATE) AS 'SUM_N_DAYS_SUCCESS_RATE'
        //               ,T1.AVG_SUCCESS_RATE AS 'DAILY_SUCCESS_RATE'
        //         FROM DAILY_AVG_SUCCESS_RATE T1
        //           LEFT JOIN DAILY_AVG_SUCCESS_RATE T2
        //             ON T2.BUILD_DATE BETWEEN
        //                DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
        //         WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY BUILD_DATE, DAILY_SUCCESS_RATE
        //         ORDER BY BUILD_DATE ASC
        //         ;
        //     `,
        //     // Segment split by this.groupByColumn
        //     `
        //         WITH DAILY_AVG_SUCCESS_RATE AS
        //         (
        //             SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
        //                   ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
        //                   ,${this.groupByColumn}
        //             FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        //             WHERE (BUILD_COMPLETED_DATE BETWEEN
        //                   DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
        //                   ${segmentQuery}
        //             GROUP BY BUILD_DATE, ${this.groupByColumn}
        //         )
        //         SELECT T1.BUILD_DATE AS 'BUILD_DATE'
        //               ,COUNT(T2.AVG_SUCCESS_RATE) AS 'N_DAYS'
        //               ,SUM(T2.AVG_SUCCESS_RATE) AS 'SUM_N_DAYS_SUCCESS_RATE'
        //               ,T1.AVG_SUCCESS_RATE AS 'DAILY_SUCCESS_RATE'
        //               ,T1.${this.groupByColumn} AS '${this.groupByColumn}'
        //         FROM DAILY_AVG_SUCCESS_RATE T1
        //           LEFT JOIN DAILY_AVG_SUCCESS_RATE T2
        //             ON
        //             (
        //                 T2.BUILD_DATE BETWEEN
        //                 DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
        //             )
        //             AND
        //             (
        //                 T2.${this.groupByColumn} = T1.${this.groupByColumn}
        //             )
        //         WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY BUILD_DATE, ${this.groupByColumn}
        //         ORDER BY ${this.groupByColumn} ASC, BUILD_DATE ASC
        //         ;
        //     `
        // ];
    }

    private addOverallToChart(data: any, chart: Array<any>)
    {
        /* Sample result for 7 days:
        +---------------------+--------+-------------------------+--------------------+
        | BUILD_DATE          | N_DAYS | SUM_N_DAYS_SUCCESS_RATE | DAILY_SUCCESS_RATE |
        +---------------------+--------+-------------------------+--------------------+
        | 2018-03-26 00:00:00 |     29 |                 12.7062 |             0.5789 |
        | 2018-03-27 00:00:00 |     29 |                 12.8216 |             0.6154 |
        | 2018-03-28 00:00:00 |     29 |                 12.9874 |             0.4783 |
        | 2018-03-29 00:00:00 |     29 |                 12.8928 |             0.4348 |
        | 2018-03-30 00:00:00 |     29 |                 13.1733 |             0.4286 |
        | 2018-03-31 00:00:00 |     29 |                 13.4541 |             0.5455 |
        | 2018-04-01 00:00:00 |     29 |                 13.5276 |             0.2500 |
        +---------------------+--------+-------------------------+--------------------+*/
        var sma: SmoothMovingAverage =
            new SmoothMovingAverage("BUILD_DATE", "N_DAYS", "SUM_N_DAYS_SUCCESS_RATE", "DAILY_SUCCESS_RATE");
        var xy: any = sma.GetXY(data);
        var overall: any =
        {
            x: xy.x,
            y: xy.y,
            name: "All Builds",
            type: "scatter",
            mode: "lines",
            line:
            {
                "shape": "spline",
                "smoothing": 1.3,
                "width": 3
            }
        };
        chart.push(overall);
    }

    private addSegmentsToChart(data: any, chart: Array<any>)
    {
        /* Sample result for 7 days:
        +---------------------+--------+-------------------------+--------------------+---------------+
        | BUILD_DATE          | N_DAYS | SUM_N_DAYS_SUCCESS_RATE | DAILY_SUCCESS_RATE | PLATFORM_NAME |
        +---------------------+--------+-------------------------+--------------------+---------------+
        | 2018-03-26 00:00:00 |     28 |                 15.6565 |             0.5714 | Linux         |
        | 2018-03-27 00:00:00 |     28 |                 15.2719 |             0.6154 | Linux         |
        | 2018-03-28 00:00:00 |     28 |                 15.4783 |             0.4286 | Linux         |
        | 2018-03-29 00:00:00 |     28 |                 15.5497 |             0.5714 | Linux         |
        | 2018-03-30 00:00:00 |     28 |                 16.0497 |             0.6250 | Linux         |
        | 2018-03-31 00:00:00 |     28 |                 16.5497 |             0.7778 | Linux         |
        | 2018-04-01 00:00:00 |     28 |                 17.3622 |             1.0000 | Linux         |
        | 2018-03-26 00:00:00 |     27 |                 12.9095 |             0.5000 | Mac           |
        | 2018-03-27 00:00:00 |     27 |                 13.4095 |             0.7500 | Mac           |
        | 2018-03-29 00:00:00 |     26 |                 12.2428 |             0.3333 | Mac           |
        | 2018-03-30 00:00:00 |     26 |                 13.1178 |             1.0000 | Mac           |
        | 2018-03-31 00:00:00 |     26 |                 13.2785 |             0.2857 | Mac           |
        | 2018-03-26 00:00:00 |     29 |                  8.7819 |             0.6000 | Windows       |
        | 2018-03-27 00:00:00 |     29 |                  8.3375 |             0.5556 | Windows       |
        | 2018-03-28 00:00:00 |     29 |                  8.6931 |             0.5556 | Windows       |
        | 2018-03-29 00:00:00 |     29 |                  8.2598 |             0.1667 | Windows       |
        | 2018-03-30 00:00:00 |     29 |                  8.0780 |             0.0000 | Windows       |
        | 2018-03-31 00:00:00 |     29 |                  8.2030 |             0.5000 | Windows       |
        | 2018-04-01 00:00:00 |     29 |                  8.0212 |             0.0000 | Windows       |
        +---------------------+--------+-------------------------+--------------------+---------------+*/
        var sma: SmoothMovingAverage =
            new SmoothMovingAverage("BUILD_DATE", "N_DAYS", "SUM_N_DAYS_SUCCESS_RATE", "DAILY_SUCCESS_RATE");

        // First segment
        var segment: string = data[0][this.groupByColumn];
        var start: number = 0;

        for (let i: number = 1; i < data.length; ++i)
        {
            // segment change
            if (data[i][this.groupByColumn] != segment)
            {
                let xy: any = sma.GetXY(data, start, i-1);
                let segmentChart: any =
                {
                    x: xy.x,
                    y: xy.y,
                    name: segment,
                    type: "scatter",
                    mode: "lines",
                    line:
                    {
                        "shape": "spline",
                        "smoothing": 1.3,
                        "width": 1
                    }
                };
                start = i;
                segment = data[i][this.groupByColumn];
                chart.push(segmentChart);
            }
            // last record
            if (i == data.length - 1)
            {
                let xy: any = sma.GetXY(data, start, i);
                let segmentChart: any =
                {
                    x: xy.x,
                    y: xy.y,
                    name: data[i][this.groupByColumn],
                    type: "scatter",
                    mode: "lines",
                    line:
                    {
                        "shape": "spline",
                        "smoothing": 1.3,
                        "width": 1
                    }
                };
                chart.push(segmentChart);
            }
        }
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
        if (jsonArrays[0].length < 2 || jsonArrays[1].length < 6)
        {
            return null;
        }

        var chart: any = [];
        this.addOverallToChart(jsonArrays[0], chart);
        this.addSegmentsToChart(jsonArrays[1], chart);

        // Return Plotly.js consumable
        return {
            data: chart,
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Date",
                    fixedrange: true,
                    range: [this.chartFromDate, this.chartToDate]
                },
                yaxis: {
                    title: "Daily success rate",
                    tickformat: ",.0%",
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [
                    // Daily Target Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: this._target,
                        y1: this._target,
                        line: {
                            color: "rgb(0, 255, 0)",
                            width: 4,
                            dash:"dot"
                        }
                    },
                    // Daily Stretch Goal Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: this._stretchGoal,
                        y1: this._stretchGoal,
                        line: {
                            color: "gold",
                            width: 4,
                            dash:"dot"
                        }
                    }
                ]
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}