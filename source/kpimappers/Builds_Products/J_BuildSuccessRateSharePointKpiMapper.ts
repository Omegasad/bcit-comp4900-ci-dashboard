import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * J_BuildSuccessRateSharePointKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class J_BuildSuccessRateSharePointKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PRODUCT_NAME";
    protected filterValue: string = "'SharePoint'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}