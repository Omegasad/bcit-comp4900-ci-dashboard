import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * F_BuildSuccessRateMacKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class F_BuildSuccessRateMacKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PLATFORM_NAME";
    protected filterValue: string = "'Mac'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}