import { Transform } from "stream"
import { IDataInterface } from "../datainterfaces/IDataInterface";

/**
 * TransformStream.
 * 
 * Transforms JSON objects using a given DataInterface and pushes it down the pipeline.
 */
export class TransformStream extends Transform
{
    private _dataInterface: IDataInterface;

    /**
     * Constructor.
     * @param {IDataInterface} dataInterface IDataInterface used to transform the JSON object
     */
    public constructor(dataInterface: IDataInterface)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._dataInterface = dataInterface;
    }

    /**
     * Transforms a JSON object using an IDataInterface.
     * Called automatically when used in a pipe.
     * @param {object} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} done callback when finished transforming jsonObj or error
     * @override
     */
    public _transform(jsonObj: object, encoding: string, done: Function): void
    {
        try
        {
            var transformed: Array<any>|null = this._dataInterface.Transform(jsonObj);
            if (transformed != null)
            {
                this.push(transformed);
            }
            done();
        }
        catch (err)
        {
            done(err);
        }
    }
}