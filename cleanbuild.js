var fs = require('fs')

deleteFolderRecursive("./build");
function deleteFolderRecursive(path)
{
    if (fs.existsSync(path))
    {
        fs.readdirSync(path).forEach((file, index) =>
        {
            var curPath = path + "/" + file;
            // is dir, recursive delete
            if (fs.lstatSync(curPath).isDirectory())
            {
                deleteFolderRecursive(curPath);
            }
            // is file, delete file
            else
            {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}