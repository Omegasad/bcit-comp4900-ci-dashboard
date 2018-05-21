var db = {};

/*******************
 * D A T A B A S E *
 *******************/

db.connection =
{
    host:       "localhost",
    port:       3306,
    database:   "cidashboard",
    user:       "root",
    password:   "password"
};

db.tablename =
{
    // Stores meta info on each IDataInterface source
    //      e.g. qa_builds_and_runs_from_bamboo
    data_source_tracker:            "data_source_tracker",

    // Sample data taken from data/sample_data_source.py
    sample_data:                    "sample_data",

    qa_builds_and_runs_from_bamboo: "qa_builds_and_runs_from_bamboo",
    bug_resolution_dates:           "bug_resolution_dates",
    resolved_story_points:          "resolved_story_points"
}

module.exports = db;