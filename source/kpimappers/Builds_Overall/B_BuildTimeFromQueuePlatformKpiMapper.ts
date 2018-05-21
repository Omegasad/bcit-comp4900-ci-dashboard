import * as moment from "moment"
import { BuildTimeFromQueueSegmentKpiMapper } from "../BuildTimeFromQueueSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * B_BuildTimeFromQueuePlatformKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class B_BuildTimeFromQueuePlatformKpiMapper extends BuildTimeFromQueueSegmentKpiMapper
{
    protected groupByColumn: string = "PLATFORM_NAME";
    protected filterColumn: string = "";
    protected filterValue: string = "";
    public readonly Title: string = `Build Time From Queue Per Platform`;
}