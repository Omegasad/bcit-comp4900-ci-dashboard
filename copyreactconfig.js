var fs = require("fs")

fs.createReadStream("./config/config.dashboard.js")
    .pipe(fs.createWriteStream("./react-app/src/config.react.js"));