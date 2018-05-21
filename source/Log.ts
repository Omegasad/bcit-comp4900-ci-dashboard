import * as moment from "moment"
import { appendFile } from "fs"
const config = require("../config/config");

const logDirectory: string = "./" + config.log.directory;

/**
 * Log error messages.
 * @param {Error} error object
 * @param {string} additionalInfo to be logged
 */
export function Log(error: Error, additionalInfo: string)
{
    var datestamp: string = moment().format("YYYY-MM-DD");
    var fulldatestamp: string = moment().format("YYYY-MM-DD HH.mm.ss.SSS");
    var filename: string = `${logDirectory}/${datestamp}.log`;
    var metadata: string = `\n\n\n-----------------------------------------------
TIMESTAMP: ${fulldatestamp}\n\n${additionalInfo}`;

    appendFile(filename, `${metadata}\n\n${error}\n\n${error.stack}`, (error: Error) =>
    {
        if (error)
        {
            console.log(error);
        }
    });
}