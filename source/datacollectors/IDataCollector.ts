import { Stream } from "stream"

/**
 * IDataCollector.
 * 
 * Returns a stream to the data source.
 */
export interface IDataCollector
{
    /**
     * Initialize the data source for a given date range.
     * Must be able to handle multiple Initialize calls without disposing IDataCollector.
     * @param {Date} from
     * @param {Date} to
     */
    Initialize(from: Date, to: Date): void;

    /**
     * Returns a stream to the data.
     * @returns {Stream} stream of data
     */
    GetStream(): Stream;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}