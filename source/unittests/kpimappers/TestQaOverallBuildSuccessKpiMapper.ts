// import * as assert from "assert"
// //import * as fs from "fs"
// import { QaBuildsAndRunsFromBambooDataInterface } from "../../datainterfaces/QaBuildsAndRunsFromBambooDataInterface"
// import { QaOverallBuildSuccessKpiMapper } from "../../kpimappers/QaOverallBuildSuccessKpiMapper"
// import { MysqlDataStorage } from "../../datastorages/MysqlDataStorage"
// import { JsonDataCollector } from "../../datacollectors/JsonDataCollector"
// import { IKpiState } from "../../kpimappers/IKpiState"
// import { Scheduler } from "../../services/Scheduler"
// import { ISchedule } from "../../services/ISchedule"
// const config = require("../../../config/config");

// var storage: MysqlDataStorage;
// var mapper : QaOverallBuildSuccessKpiMapper;

// describe("kpimappers/QaOverallBildSuccessKpiMapper", () =>
// {

//     before(async () =>
//     {
//         var createTable: string = 
//         `CREATE TABLE IF NOT EXISTS test_qa
//         (
//             BUILDRESULTSUMMARY_ID           INT             PRIMARY KEY NOT NULL,
//             MINUTES_TOTAL_QUEUE_AND_BUILD   INT             NOT NULL,
//             BUILD_COMPLETED_DATE            DATETIME        NOT NULL,
//             CYCLE                           CHAR(6)         NOT NULL,
//             PLATFORM                        VARCHAR(50)     NOT NULL,
//             PRODUCT                         VARCHAR(50)     NOT NULL,
//             IS_DEFAULT                      TINYINT(1)      NOT NULL,
//             IS_SUCCESS                      TINYINT(1)      NOT NULL,
//             BRANCH_ID                       INT             NOT NULL
//         )`;

//         storage = new MysqlDataStorage(config.db.connection);
//         mapper = new QaOverallBuildSuccessKpiMapper();
//         mapper.SetDataStorage(storage);
//         const scheduler: Scheduler = new Scheduler(storage);
//         await storage.Initialize();
//         await storage.Query(createTable);

//         //Create and add entries containing dates that spans 1 year and 10 days
//         //Using client data
//         var schedule: ISchedule =
//         {
//             Title: "Something",
//             DataCollector: new JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*"),
//             DataInterface: new QaBuildsAndRunsFromBambooDataInterface(),
//             RunIntervalInMinutes: 999, 
//             DataFromDate: new Date("2017-04-01"),
//             DataToDate: new Date("2018-04-10")
//         }

//         try
//         {
//             await scheduler.Schedule(schedule);
//         }
//         catch (err)
//         {
//             console.log("ERROR:");
//             console.log(err);
//         }


//     });

//     describe("KPI State Object is Created from Preset Date Ranges", () =>
//     {
        
//         it("retrieve 7 day range", () =>
//         {
//             var expected:IKpiState = 
//             {
//                 "data": [
//                     {
//                         "values": [
//                             74,
//                             92
//                         ],
//                         "labels": [
//                             0,
//                             1
//                         ],
//                         "type": "pie"
//                     }
//                 ],
//                 "layout": {
//                     "title": "QA Overall Build Success vs Fail"
//                 },
//                 "frames": [],
//                 "config": {}
//             };
//             var fromDate : Date = new Date('2017-05-01');
//             var toDate : Date = new Date('2017-05-07');
//             mapper.GetKpiStateOrNull(fromDate, toDate)
//             .then((results: IKpiState|null) =>
//             {
//                 assert.deepEqual(results, expected);
//             })
//             .catch((err: Error) =>
//             {
//                 console.log("ERROR:");
//                 console.log(err);
//             });
//         });

//         it("retrieve 30 day range", () =>
//         {
//             var expected:IKpiState = 
//             {
//                 "data": [
//                     {
//                         "values": [
//                             74,
//                             92
//                         ],
//                         "labels": [
//                             0,
//                             1
//                         ],
//                         "type": "pie"
//                     }
//                 ],
//                 "layout": {
//                     "title": "QA Overall Build Success vs Fail"
//                 },
//                 "frames": [],
//                 "config": {}
//             };
//             var fromDate : Date = new Date('2017-05-01');
//             var toDate : Date = new Date('2017-05-07');
//             mapper.GetKpiStateOrNull(fromDate, toDate)
//             .then((results: IKpiState|null) =>
//             {
//                 assert.deepEqual(results, expected);
//             })
//             .catch((err: Error) =>
//             {
//                 console.log("ERROR:");
//                 console.log(err);
//             });
//         });

//     });

//     describe("KPI State Object - Date Range Edge Cases", () =>
//     {
        
//         it("KPI Object not created if 'From' date is before the first entry ", () =>
//         {
           
//         });

//         it("Object not created if 'To' date is after the last entry", () =>
//         {

//         });

//     });

// });