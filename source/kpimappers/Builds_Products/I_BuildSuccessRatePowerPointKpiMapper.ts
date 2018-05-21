import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * I_BuildSuccessRatePowerPointKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class I_BuildSuccessRatePowerPointKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PRODUCT_NAME";
    protected filterValue: string = "'PowerPoint'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}