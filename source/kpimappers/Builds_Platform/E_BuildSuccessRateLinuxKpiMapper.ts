import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * E_BuildSuccessRateLinuxKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class E_BuildSuccessRateLinuxKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PLATFORM_NAME";
    protected filterValue: string = "'Linux'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}