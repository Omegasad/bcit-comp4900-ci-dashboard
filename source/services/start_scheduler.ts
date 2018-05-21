import { IDataStorage } from "../datastorages/IDataStorage"
import { Scheduler } from "./Scheduler"
const schedules = require("../../config/schedules")

export async function start_scheduler(storage: IDataStorage): Promise<void>
{
    console.log("\n\nScheduling data collection...");
    const scheduler: Scheduler = new Scheduler(storage);

    for (let aSchedule of schedules)
    {
        try
        {
            if (await scheduler.Schedule(aSchedule))
            {
                console.log(`Scheduled ${aSchedule.Title} to run every ${aSchedule.RunIntervalInMinutes} minutes.`);
            }
            else
            {
                console.log(`Failed to schedule ${aSchedule.Title}.`);
            }
        }
        catch (err)
        {
            console.log(`SCHEDULING ERROR for ${aSchedule.Title}:`);
            console.log(err);
        }
    }

    // // Generate exit signal for windows
    // if (process.platform === "win32")
    // {
    //     var rl = require("readline")
    //         .createInterface
    //         ({
    //             input: process.stdin,
    //             output: process.stdout
    //         });

    //     rl.on("SIGINT", () =>
    //     {
    //         process.emit("SIGINT");
    //     });
    // }

    // // Exit signal
    // process.on("SIGINT", () =>
    // {
    //     console.log("exiting...");
    //     process.exit();
    // });
}

// function shutdownWhenNoSchedulesRunning()
// {
//     // setTimeout(() =>
//     // {

//     // });
// }