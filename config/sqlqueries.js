const config = require("./config")

var sqlqueries = {};

sqlqueries.setup =
[
    // Keeps track of the date ranges the server has successfully
    // downloaded from different data sources
    //
    // NOTE: the default key on FROM_DATE and TO_DATE determines
    // the date from which new data sources will download from
    `CREATE TABLE IF NOT EXISTS ${config.db.tablename.data_source_tracker}
    (
        TABLE_NAME  VARCHAR(255)    NOT NULL PRIMARY KEY,
        FROM_DATE   DATETIME        NOT NULL DEFAULT '2017-01-01',
        TO_DATE     DATETIME        NOT NULL DEFAULT '2017-01-01'
    )`,

    // Create Sample data table
    `CREATE TABLE IF NOT EXISTS ${config.db.tablename.sample_data}
    (
        ID          INT             NOT NULL PRIMARY KEY
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.sample_data}')`,

    // Create QA Builds and Runs from Bamboo data table
    `CREATE TABLE IF NOT EXISTS ${config.db.tablename.qa_builds_and_runs_from_bamboo}
    (
        BUILDRESULTSUMMARY_ID           INT             NOT NULL PRIMARY KEY,
        MINUTES_TOTAL_QUEUE_AND_BUILD   INT             NOT NULL,
        BUILD_COMPLETED_DATE            DATETIME        NOT NULL,
        CYCLE                           CHAR(6)         NOT NULL,
        PLATFORM_CODE                   CHAR(3)         NOT NULL,
        PRODUCT_CODE                    CHAR(2)         NOT NULL,
        PLATFORM_NAME                   VARCHAR(50)     NOT NULL,
        PRODUCT_NAME                    VARCHAR(50)     NOT NULL,
        IS_DEFAULT                      TINYINT(1)      NOT NULL,
        IS_SUCCESS                      TINYINT(1)      NOT NULL,
        BUILD_STATE                     VARCHAR(30)     NOT NULL,
        BRANCH_ID                       INT
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.qa_builds_and_runs_from_bamboo}')`,

    // Create Bug Resolution Dates data table
    `CREATE TABLE IF NOT EXISTS ${config.db.tablename.bug_resolution_dates}
    (
        BUG_ID          VARCHAR(15) NOT NULL PRIMARY KEY,
        PRIORITY        VARCHAR(20) NOT NULL,
        CREATION_DATE   DATETIME    NOT NULL,
        RESOLUTION_DATE DATETIME
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.bug_resolution_dates}')`,

    // Create Resolved Story Points data table
    `CREATE TABLE IF NOT EXISTS ${config.db.tablename.resolved_story_points}
    (
        STORY_ID        VARCHAR(15) NOT NULL PRIMARY KEY,
        RESOLUTION_DATE DATETIME    NOT NULL,
        STORY_POINTS    FLOAT
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.resolved_story_points}')`
];

module.exports = sqlqueries;