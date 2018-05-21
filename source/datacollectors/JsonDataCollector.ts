import * as fs from "fs"
import { Writable, Stream } from "stream"
import { IDataCollector } from "./IDataCollector"
const json = require("JSONStream");

/**
 * JsonDataCollector.
 * 
 * Returns a stream to the JSON file.
 */
export class JsonDataCollector implements IDataCollector
{
    private _filepath: string;
    private _jsonParsePath: string;

    /**
     * Constructor.
     * @param {string} filepath to JSON to-be read
     * @param {string} jsonParsePath JSONPath to parse (see https://www.npmjs.com/package/JSONStream)
     */
    public constructor(filepath: string, jsonParsePath: string = "$*")
    {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
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
     * Returns a Stream stream of the JSON file.
     * @returns {Stream} stream to the JSON file
     * @override
     */
    public GetStream(): Stream
    {
        var _jsonStream: Writable = json.parse(this._jsonParsePath);
        return fs.createReadStream(this._filepath)
            // forward read stream's error to _jsonStream
            // giving downstream access to errors
            .on("error", (err: Error) => { _jsonStream.emit("error", err) })
            .pipe(_jsonStream);
    }

    /**
     * Not used.
     * @override
     */
    public Dispose(): void
    {
    }
}