const express = require('express');

const app = express();


app.listen(process.env.PORT||process.env.SV_PORT, function () {
    console.log("Started server on",process.env.PORT||3000);

})