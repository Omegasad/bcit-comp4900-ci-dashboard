/**
 * SmoothMovingAverage.
 * 
 *      WARNING:
 * 
 *      This has been deprecated.
 * 
 *  Uses formula listed in :
 *   https://mahifx.com/mfxtrade/indicators/smoothed-moving-average-smma
 * 
 *  Required in SQL Results:
 *   - dateColName = BUILD_DATE
 *   - nDaysColName = N_DAYS
 *   - nDaysSumColName = SUM_N_DAYS_SUCCESS_RATE
 *   - dailyColName = DAILY_SUCCESS_RATE
 *
 *  Sample result for 7 days:
 *  +---------------------+--------+-------------------------+--------------------+
 *  | BUILD_DATE          | N_DAYS | SUM_N_DAYS_SUCCESS_RATE | DAILY_SUCCESS_RATE |
 *  +---------------------+--------+-------------------------+--------------------+
 *  | 2018-03-26 00:00:00 |     29 |                 12.7062 |             0.5789 |
 *  | 2018-03-27 00:00:00 |     29 |                 12.8216 |             0.6154 |
 *  | 2018-03-28 00:00:00 |     29 |                 12.9874 |             0.4783 |
 *  | 2018-03-29 00:00:00 |     29 |                 12.8928 |             0.4348 |
 *  | 2018-03-30 00:00:00 |     29 |                 13.1733 |             0.4286 |
 *  | 2018-03-31 00:00:00 |     29 |                 13.4541 |             0.5455 |
 *  | 2018-04-01 00:00:00 |     29 |                 13.5276 |             0.2500 |
 *  +---------------------+--------+-------------------------+--------------------+
 */
export class SmoothMovingAverage
{
    private _minPrevDays: number = 15;

    private _dateColName: string;
    private _nDaysColName: string;
    private _nDaysSumColName: string;
    private _dailyColName: string;

    /**
     * Constructor.
     * @param {string} dateColName Column name for date
     * @param {string} nDaysColName Column name for n number of days
     * @param {string} nDaysSumColName Column name for the sum of n days
     * @param {string} dailyColName Column name for the daily value
     */
    public constructor
    (
        dateColName: string,
        nDaysColName: string,
        nDaysSumColName: string,
        dailyColName: string
    )
    {
        this._dateColName = dateColName;
        this._nDaysColName = nDaysColName;
        this._nDaysSumColName = nDaysSumColName;
        this._dailyColName = dailyColName;
    }

    /**
     * Returns the XY data for smooth moving average.
     * @param {Array<any>} data containing the 4 columns set in constructor
     * @param {number} [startI] start from this index (inclusive)
     * @param {number} [endI] end at this index (inclusive)
     * @returns XY data for smooth moving average
     */
    public GetXY(data: Array<any>, startI?: number, endI?: number): object
    {
        var sI: number = (startI) ? startI : 0;
        var eI: number = (endI) ? endI : data.length - 1;

        var x: Array<any> = [];
        var y: Array<any> = [];

        // moving average for first day
        var movingAverage: number = data[sI][this._nDaysSumColName] / data[sI][this._nDaysColName];
        x.push(data[sI][this._dateColName]);
        y.push(movingAverage);

        // calculate moving average for subsequent days
        for (let i: number = sI + 1; i <= eI; ++i)
        {
            movingAverage =
            (
                data[i-1][this._nDaysSumColName]  // prev day's summed rate
                - movingAverage                   // prev day's moving avg
                + data[i][this._dailyColName]     // today's rate
            ) / data[i-1][this._nDaysColName];    // n days used in prev day's moving avg
            x.push(data[i][this._dateColName]);
            if (data[i][this._nDaysColName] < this._minPrevDays)
            {
                y.push(null);
            }
            else
            {
                y.push(movingAverage);
            }
        }

        return {
            x: x,
            y: y
        };
    }
}