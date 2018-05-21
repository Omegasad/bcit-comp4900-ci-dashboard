import { IDataCollector } from "../datacollectors/IDataCollector"
import { IDataInterface } from "../datainterfaces/IDataInterface"

/**
 * ISchedule.
 * 
 * Template of how a schedule needs to look like.
 */
export interface ISchedule
{
    readonly Title: string;
    readonly DataCollector: IDataCollector;
    readonly DataInterface: IDataInterface;
    readonly RunIntervalInMinutes: number;

    readonly DataFromDate?: Date;
    readonly DataToDate?: Date;
}