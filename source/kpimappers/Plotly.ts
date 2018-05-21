/**
 * Plotly.
 * 
 * Helper functions for generating Plotly.js structures.
 */
export class Plotly
{
    /**
     * Returns a Plotly trace line object.
     * Used in the "data" array in IKpiState.
     * @param {string} title of trace line
     * @param {Array<any>} x values of trace line
     * @param {Array<any>} y values of trace line
     * @param {number} [width] of trace line
     * @returns a Plotly trace line object
     */
    public static GetTraceLineData(title: string, x: Array<any>, y: Array<any>, width?: number): object
    {
        return {
            name: title,
            x: x,
            y: y,
            type: "scatter",
            mode: "lines",
            line: {
                "shape": "spline",
                "smoothing": 1.3,
                "width": (width) ? width : 2
            }
        };
    }

    /**
     * Returns legend positioning information.
     * Used in the "layout" property of IKpiState.
     */
    public static GetLegendInfo(): object
    {
        return {
            xanchor: "center",
            yanchor: "bottom"
        };
    }

    /**
     * Returns a Plotly X-Axis object for dates given a date range.
     * Used in the "layout" property of IKpiState.
     * @param {string} from date
     * @param {string} to date
     * @returns a Plotly X-axis object for dates
     */
    public static GetDateXAxis(from: string, to: string): object
    {
        return {
            title: "Date",
            type: "date",
            showline: true,
            fixedrange: true,
            range: [from, to]
        };
    }

    /**
     * Returns a Plotly Y-Axis object given a title.
     * Used in the "layout" property of IKpiState.
     * @param title of y-axis
     * @returns a Plotly y-axis object
     */
    public static GetYAxis(title: string): object
    {
        return {
            title: title,
            showline: true,
            fixedrange: true,
            rangemode: "tozero"
        };
    }

    /**
     * Returns a Plotly Y2-Axis object given a title.
     * Used in the "layout" property of IKpiState.
     * @param title of y2-axis
     * @returns a Plotly y2-axis object
     */
    public static GetY2Axis(title: string): object
    {
        return {
            title: title,
            showline: true,
            fixedrange: true,
            rangemode: "tozero",
            overlaying: "y",
            side: "right"
        };
    }

    /**
     * Returns a Plotly Y-Axis object for percentages given a title.
     * Used in the "layout" property of IKpiState.
     * @param title of y-axis
     * @returns a Plotly y-axis percentage object
     */
    public static GetYPercentAxis(title: string): object
    {
        return {
            title: title,
            showline: true,
            fixedrange: true,
            tickformat: ",.0%",
            range: [0,1],
            rangemode: "tozero"
        };
    }

    /**
     * Returns a Plotly shapes array given a target and stretch goal.
     * Used in the "layout" property of IKpiState.
     * @param {number} target goal
     * @param {number} stretch goal
     * @returns a Plotly shapes array
     */
    public static GetShapesFromGoals(target: number, stretch: number): Array<any>
    {
        return [
            // Target Line
            {
                type: "line",
                xref: "paper",
                x0: 0,
                x1: 1,
                y0: target,
                y1: target,
                line: {
                    color: "rgb(0, 255, 0)",
                    width: 4,
                    dash:"dot"
                }
            },
            // Stretch Goal Line
            {
                type: "line",
                xref: "paper",
                x0: 0,
                x1: 1,
                y0: stretch,
                y1: stretch,
                line: {
                    color: "gold",
                    width: 4,
                    dash:"dot"
                }
            }
        ];
    }
}