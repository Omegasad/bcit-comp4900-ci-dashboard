import * as moment from "moment"
import * as assert from "assert"
import * as fs from "fs"
import { PythonShellJsonDataCollector } from "../../datacollectors/PythonShellJsonDataCollector"

describe("datacollectors/PythonShellJsonDataCollector", () =>
{
    // pyfile input command:
    // 1 = spit out valid json objects
    // 2 = spit out invalid json objects
    // 3 = crash with division by zero in middle of transfering valid json objects
    // 4 = exit program with exit code
    const pyfile: string = "./source/unittests/datacollectors/unittests.py";

    // valid json objects matching pyfile
    // const monkey: any = {name: "Banana", age: 3};
    // const person: Array<any> = [{name: "Joey Zap", age: 5}, {name: "Ren", age: 22}];

    // python shell
    const pyshell: PythonShellJsonDataCollector = new PythonShellJsonDataCollector(pyfile, "*");

    describe("Pre-requisite(s)", () =>
    {
        it("python test file exists", () =>
        {
            assert.equal(fs.existsSync(pyfile), true);
        });
    });

    describe("Initialization", () =>
    {
        it("should throw NOT_INITIALIZED_ERR getting uninitialized stream", () =>
        {
            assert.throws(() =>
            {
                new PythonShellJsonDataCollector(pyfile, "*").GetStream();
            }, /NOT_INITIALIZED_ERR/);
        });
    });

    describe("Receive JSON Objects", () =>
    {
        it("should receive correct # and identical json objects to ones sent", (done: Function) =>
        {
            var counter = 1;
            pyshell.Initialize(moment(moment("2018-01-01").format("YYYY-MM-DD")).toDate(), new Date());
            pyshell.GetStream()
                .on("data", (data: any) =>
                {
                    if (counter++ == 1)
                    {
                        assert.equal(data.name, "Banana");
                        assert.equal(data.age, 3);
                    }
                    if (counter == 3)
                    {
                        done();
                    }
                });
        });

        it("should throw error and no data when python sends invalid json objects", (done: Function) =>
        {
            pyshell.Initialize(moment(moment("2018-01-02").format("YYYY-MM-DD")).toDate(), new Date());
            pyshell.GetStream()
                .on("data", (data: any) =>
                {
                    done(new Error("Data received for invalid json object"));
                })
                .on("error", (err: any) =>
                {
                    // 'The Exception ignored in' error happens intermitently
                    // due to reporting of broken stdout pipe during interpreter shutdown
                    // https://bugs.python.org/issue11380
                    // It intermitently happens in Windows 10 Python 2 and Python 3
                    if (!/Invalid JSON/.test(err.message) && !/Exception ignored in/.test(err.message))
                    {
                        done(err);
                        return;
                    }
                    done();
                });
        });

        it("should throw 'exited with code 10' error when python script crashes from sys.exit(10)", (done: Function) =>
        {
            pyshell.Initialize(moment(moment("2018-01-03").format("YYYY-MM-DD")).toDate(), new Date());
            pyshell.GetStream()
                .on("data", (data: any) => {})
                .on("error", (err: Error) =>
                {
                    if (!/exited with code 10/.test(err.message))
                    {
                        done(err);
                        return;
                    }
                    done();
                });
        });

        it("should throw 'ZeroDivisionError' when python script crashes from division by zero", (done: Function) =>
        {
            pyshell.Initialize(moment(moment("2018-01-04").format("YYYY-MM-DD")).toDate(), new Date());
            pyshell.GetStream()
                .on("data", (data: any) => {})
                .on("error", (err: any) =>
                {
                    if (!/ZeroDivisionError/.test(err.message))
                    {
                        done(err);
                    }
                    done();
                });
        });
    });
});