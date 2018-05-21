import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * G_BuildSuccessRateWordKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class G_BuildSuccessRateWordKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PRODUCT_NAME";
    protected filterValue: string = "'Word'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}