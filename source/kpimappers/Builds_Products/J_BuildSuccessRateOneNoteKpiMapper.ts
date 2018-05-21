import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * J_BuildSuccessRateOneNoteKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class J_BuildSuccessRateOneNoteKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "PRODUCT_NAME";
    protected filterValue: string = "'OneNote'";
    public readonly Title: string = `Build Success Rate (${this.filterValue})`;
}