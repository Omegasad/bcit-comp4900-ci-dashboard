import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * H_BuildSuccessRateExcelKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class H_BuildSuccessRateExcelKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PRODUCT_NAME";
    protected filterValue: string = "'Excel'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}