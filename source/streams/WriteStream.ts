import { Writable } from "stream"
import { IDataStorage } from "../datastorages/IDataStorage";
import { IDataInterface } from "../datainterfaces/IDataInterface"
const config = require("../../config/config")

/**
 * WriteStream.
 * 
 * Writes JSON objects using a given Storage medium.
 */
export class WriteStream extends Writable
{
    private readonly _BUFFER_LIMIT: number = config.pipeline.write_buffer_limit;
    private _dataStorage: IDataStorage;
    private _dataInterface: IDataInterface;
    private _buffer: Array<any>;
    private _bufferCount: number;

    /**
     * Constructor.
     * @param {IDataStorage} dataStorage used to store the data
     * @param {IDataInterface} dataInterface used to transform the JSON object
     */
    public constructor(dataStorage: IDataStorage, dataInterface: IDataInterface)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._dataStorage = dataStorage;
        this._dataInterface = dataInterface;
        this._buffer = [];
        this._bufferCount = 0;
    }

    /**
     * Writes stream data to storage using a StorageWriter.
     * Called automatically when used in a pipe.
     * @param {Array<any>|null} data from the stream
     * @param {string} encoding not used
     * @param {Function} done callback when finished writing data or error
     * @throws {Error} when data storage write fails
     * @override
     */
    public _write(data: Array<any>|null, encoding: string, done: Function): void
    {
        if (data == null)
        {
            done();
            return;
        }

        this._buffer.push(data);

        if (++this._bufferCount == this._BUFFER_LIMIT)
        {
            this._bufferCount = 0;
            this.writeBuffer(done);
        }
        else
        {
            done();
        }
    }

    /**
     * Automatically called when read stream ends.
     * @param {Function} cb Callback function
     * @override
     */
    public _final(cb: Function): void
    {
        if (this._bufferCount != 0)
        {
            this.writeBuffer((err: Error) =>
            {
                cb(err);
            });
        }
        else
        {
            cb();
        }
    }

    /**
     * Writes stream data to storage using StorageWriter asynchronously.
     * @async
     * @param {Array<any>} data from the stream
     * @param {Function} done callback when finished writing data or error
     * @throws {Error} when data storage write fails
     */
    private async writeBuffer(done: Function): Promise<void>
    {
        try
        {
            await this._dataStorage.Write
            (
                this._dataInterface.TableName,
                this._dataInterface.TableColumns,
                this._buffer
            );
            done();
        }
        catch (err)
        {
            done(err);
        }
    }
}