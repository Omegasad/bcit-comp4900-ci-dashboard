const config = require("../../config/config")

/**
 * Returns the period (number of days) of a simple moving average given a date range.
 */
export class SimpleMovingAveragePeriod
{
    /**
     * Returns the period (number of days) of a simple moving average given a date range.
     * @param {number} dateRange number of days between start and end date (inclusive)
     */
    public static GetPeriod(dateRange: number): number
    {
        var movingAveragePeriod: number = Math.ceil(config.kpi.moving_average.date_range_factor * dateRange);
        return Math.min(movingAveragePeriod, config.kpi.moving_average.max_days_in_period);
    }
}