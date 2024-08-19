require('dotenv').config();
var fs = require("fs");
var https = require("https");
const app = require('./app');

const PORT = process.env.SERVER_PORT || 3000;

// app.listen(PORT, () => {
//     console.log('Server running at PORT : ' + PORT);
// });

https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(PORT, function () {
    console.log(
      "Server listening on port 3000! Go to https://localhost:3000/"
    );
  });