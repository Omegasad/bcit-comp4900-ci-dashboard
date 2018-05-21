import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * D_BuildSuccessRatePlatformKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class D_BuildSuccessRatePlatformKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "PLATFORM_NAME";
    protected filterColumn: string = "";
    protected filterValue: string = "";
    public readonly Title: string = `Build Success Rate Per Platform`;
}