import * as csv from "csv-parse"
import * as fs from "fs"
import { Writable, Stream } from "stream"
import { IDataCollector } from "./IDataCollector"

/**
 * CsvDataCollector.
 * 
 * Returns a stream to the CSV file.
 */
export class CsvDataCollector implements IDataCollector
{
    private _filepath: string;

    /**
     * Constructor.
     * @param {string} filepath to CSV to-be read
     */
    public constructor(filepath: string)
    {
        this._filepath = filepath;
    }

    /**
     * Not used.
     * @param {Date} from
     * @param {Date} to
     * @override
     */
    public Initialize(from: Date, to: Date): void
    {
    }

    /**
     * Returns a stream to the CSV file.
     * @returns {Stream} stream to the CSV file
     * @override
     */
    public GetStream(): Stream
    {
        var _csvStream: Writable = csv({columns: true});
        return fs.createReadStream(this._filepath)
            // forward read stream's error to _csvStream
            // giving downstream access to errors
            .on("error", (err: Error) => { _csvStream.emit("error", err) })
            .pipe(_csvStream);
    }

    /**
     * Not used.
     * @override
     */
    public Dispose(): void
    {
    }
}