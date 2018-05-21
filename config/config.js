const config_db = require("./config.db")
const config_kpi = require("./config.kpi")

var config = {};
config.db = config_db;
config.kpi = config_kpi;

/*******************
 * P I P E L I N E *
 *******************/

config.pipeline =
{
    // Number of items to buffer before writing to database
    //
    // Writing in batches has a huge performance gain over writing on per-item
    // Used in streams/WriteStream when data collecting in schedules
    write_buffer_limit: 1000
};

/***********************
 * W E B   S E R V E R *
 ***********************/

config.webserver =
{
    port:               80,
    public_directory:   __dirname.replace(/\\/g, '/').replace(/\/[\w-]+$/, '') + "/react-app/build"
};

config.webserver.response =
{
    ok:         200, // everything is good
    error:      500, // internal error, likely an exception
    no_data:    404, // file exists, but no data to display (i.e. KPI)
    no_exists:  404  // file does not exist
};

/*****************
 * L O G G I N G *
 *****************/

config.log =
{
    directory: "logs"
};

/*************************
 * D A T E   F O R M A T *
 *************************/

/* Check different formats on: https://momentjs.com/docs/#/parsing/string-format/
    INPUT       EXAMPLE         DESCRIPTION
    -----       -------         -----------
    YYYY	    2014	        4 or 2 digit year
    YY	        14	            2 digit year
    Y	        -25	            Year with any number of digits and sign
    Q	        1..4	        Quarter of year. Sets month to first month in quarter.
    M MM	    1..12	        Month number
    MMM MMMM	Jan..December	Month name in locale set by moment.locale()
    D DD	    1..31	        Day of month
    Do	        1st..31st	    Day of month with ordinal
    DDD DDDD	1..365	        Day of year
    X	        1410715640.579	Unix timestamp
    x	        1410715640579	Unix ms timestamp

    H HH	    0..23	        Hours (24 hour time)
    h hh	    1..12	        Hours (12 hour time used with a A.)
    k kk	    1..24	        Hours (24 hour time from 1 to 24)
    a A	        am pm	        Post or ante meridiem (Note the one character a p are also considered valid)
    m mm	    0..59	        Minutes
    s ss	    0..59	        Seconds
    S SS SSS	0..999	        Fractional seconds
    Z ZZ	    +12:00	        Offset from UTC as +-HH:mm, +-HHmm, or Z
*/
config.dateformat =
{
    // Used by KPI mappers, do not add hour/minute/second or the
    // sql queries will give errored results
    mysql: "YYYY-MM-DD",

    // Used the the data source date tracker
    // Must have more fine grained info such as hour/minute/second
    mysql_tracker: "YYYY-MM-DD HH:mm:ss",

    // used for communication with python scripts
    // can be as fine grained as mysql_tracker
    python: "YYYY-MM-DD",

    // used for date input for Plot.ly charts
    charts: "YYYY-MM-DD",

    // used for displaying dates to console
    console: "YYYY-MM-DD HH:mm:ss"
};

module.exports = config;