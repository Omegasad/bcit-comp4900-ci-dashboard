import * as moment from "moment"
import { BuildTimeFromQueueSegmentKpiMapper } from "../BuildTimeFromQueueSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * A_BuildTimeFromQueueCycleKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class A_BuildTimeFromQueueCycleKpiMapper extends BuildTimeFromQueueSegmentKpiMapper
{
    protected groupByColumn: string = "CYCLE";
    protected filterColumn: string = "";
    protected filterValue: string = "";
    public readonly Title: string = `Build Time From Queue Per Cycle`;
}