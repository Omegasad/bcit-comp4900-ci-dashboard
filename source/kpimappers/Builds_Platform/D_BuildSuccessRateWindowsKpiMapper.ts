import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * D_BuildSuccessRateWindowsKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class D_BuildSuccessRateWindowsKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PLATFORM_NAME";
    protected filterValue: string = "'Windows'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}