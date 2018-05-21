import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * C_BuildSuccessRateCycleKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class C_BuildSuccessRateCycleKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "";
    protected filterValue: string = "";
    public readonly Title: string = `Build Success Rate Per Cycle`;
}