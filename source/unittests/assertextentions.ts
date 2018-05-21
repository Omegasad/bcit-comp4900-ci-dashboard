import * as assert from "assert";

export async function assertThrowsAsync(errorTypeRegex: any, fn: Function)
{
    var f = () => {};
    try
    {
        await fn();
    }
    catch (error)
    {
        f = () => {throw error};
    }
    finally
    {
        assert.throws(f, errorTypeRegex);
    }
}