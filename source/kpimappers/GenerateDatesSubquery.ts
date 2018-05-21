import * as moment from "moment"

/**
 * Returns a SQL query that generates a table of dates given the from and to date.
 */
export class GenerateDatesSubquery
{
    /**
     * Returns SQL subquery that generates a given date range.
     * @param {string} from MySQL formatted from date
     * @param {string} to MySQL formatted to date
     * @returns SQL subquery that generates a given date range
     */
    public static GetQuery(from: string, to: string): string
    {
        if (moment().diff(moment(from), "day") >= 10000)
        {
            throw new Error("The earliest day in date range cannot exceed 10,000 days in the past.");
        }

        // This has a hard limit of 10,000 days date range to the past
        return `(
            SELECT D1.DATE AS DATE
            FROM (
                SELECT CAST(DATE_ADD(NOW(), interval -(a.a + (10 * b.a) + (100 * c.a) + (1000 * d.a)) day) AS DATE) AS 'DATE'
                FROM
                    (
                        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    ) AS a
                    CROSS JOIN
                    (
                        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    ) AS b
                    CROSS JOIN
                    (
                        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    ) AS c
                    CROSS JOIN
                    (
                        SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    ) AS d
            ) D1
            WHERE D1.DATE BETWEEN '${from}' AND '${to}'
        )`;
    }
}