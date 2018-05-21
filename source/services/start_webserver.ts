import * as express from "express"
import * as fs from "fs"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "../kpimappers/IKpiState"
import { KpiMapper } from "../kpimappers/KpiMapper"
import { SimpleMovingAveragePeriod } from "../kpimappers/SimpleMovingAveragePeriod"
import { Log } from "../Log"
const config = require("../../config/config")

export function start_webserver(storage: IDataStorage): void
{
    console.log("\n\nStarting Web Server...");
    const webServer: express.Express = express();
    const kpilist: object = initializeKpisAndReturnList(storage);

    // Route index
    webServer.get("/", (request: express.Request, response: express.Response) =>
    {
        response.sendFile(config.webserver.public_directory + "/index.html");
    });

    // Route everything to React, minus paths starting with "/getkpi"
    webServer.get(/^(?!\/getkpi)[\w.=/-]*/, (request: express.Request, response: express.Response) =>
    {
        if (fs.existsSync(config.webserver.public_directory + request.path))
        {
            response.sendFile(config.webserver.public_directory + request.path);
        }
        else
        {
            response.status(config.webserver.response.no_exists).send("File not found");
        }
    });

    // Get KPI Simple Moving Average period
    webServer.get("/getkpimovingaverageperiod/:from/:to", (request: express.Request, response: express.Response) =>
    {
        try
        {
            var from: Date = new Date(request.params.from);
            var to: Date = new Date(request.params.to);
            var dateRange: number = KpiMapper.GetDateRange(from, to);
            var numberOfDays: number = SimpleMovingAveragePeriod.GetPeriod(dateRange);
            response.send(numberOfDays + "");
        }
        catch (err)
        {
            Log(err, `Can't get moving average period. Wrong date format. Expected /from/to. Error has been logged.`);
            console.log(`Can't get moving average period. Wrong date format. Expected /from/to. Error has been logged.`);
        }
    });

    // Get KPI
    webServer.get("/getkpi/:category/:kpi/:from/:to", async (request: express.Request, response: express.Response) =>
    {
        if (!kpilist[request.params.category] || !kpilist[request.params.category][request.params.kpi])
        {
            console.log(`non existent kpi: ${request.params.category}/${request.params.kpi}`);
            response.status(config.webserver.response.no_exists).send(`${request.params.kpi}: Non-existent KPI`);
            return;
        }

        try
        {
            var kpi: IKpiState|null = await kpilist[request.params.category][request.params.kpi]
                .GetKpiStateOrNull(new Date(request.params.from), new Date(request.params.to));

            if (kpi != null)
            {
                response.status(config.webserver.response.ok).send(kpi);
            }
            else
            {
                response.status(config.webserver.response.no_data)
                    .send(`${kpilist[request.params.category][request.params.kpi].Title}: Insufficient data`);
            }
        }
        catch (err)
        {
            err.name = `${kpilist[request.params.category][request.params.kpi].Title}: Server: ${err.name}`;
            console.log(`Error when serving KPI ${err.name}. Error has been logged.`);
            Log(err, "Error when serving KPI from web server.");;
            response.status(config.webserver.response.error).send(err);
        }
    });

    // Get KPI Categories
    webServer.get("/getkpicategories", (request: express.Request, response: express.Response) =>
    {
        var cats: object = {};
        for (let cat of Object.keys(kpilist))
        {
            cats[cat] = cat.replace(/_/g, ' ');
        }
        response.send(cats);
    });

    // Get KPI Category Details
    webServer.get("/getkpicategorydetails/:category", (request: express.Request, response: express.Response) =>
    {
        if (!kpilist[request.params.category])
        {
            response.status(config.webserver.response.no_exists).send("Non-existent KPI category");
            return;
        }

        response.send(Object.keys(kpilist[request.params.category]));
    });

    // Start listening
    webServer.listen(config.webserver.port, () =>
    {
        console.log(`Web Server listening on port ${config.webserver.port}`);
    });
}

function initializeKpisAndReturnList(storage: IDataStorage): any
{
    try
    {
        var kpilist: object = {};
        var dirs: string[] = fs.readdirSync("./build/kpimappers");
        for (let dirname of dirs)
        {
            if (/\.js$/.test(dirname))
            {
                continue;
            }
    
            kpilist[dirname] = {};
            let kpifilenames: string[] = fs.readdirSync(`./build/kpimappers/${dirname}`);
            for (let filename of kpifilenames)
            {
                if (!/KpiMapper\.js$/.test(filename))
                {
                    continue;
                }
    
                let name: string = filename.replace(".js", '');
                let apiName: string = filename.replace("KpiMapper.js", '');
                let req = require(`../kpimappers/${dirname}/${name}`);
                kpilist[dirname][apiName] = new req[name](storage);
            }
        }
        return kpilist;
    }
    catch (err)
    {
        console.log("Failed to initialize all KPI mappers. Ensure filename and classname are identical.");
        console.log(err);
        process.exit();
    }
}