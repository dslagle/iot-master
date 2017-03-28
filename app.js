const bp = require("body-parser");
const express = require("express");
const http = require("http");
const router = require("./routes");
const path = require("path");

const app = express();
const address = "0.0.0.0";
const port = 9000;

const server = http.createServer(app);

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PATH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//app.use('/data', DataRouter(io));
app.use("/test", router);

server.listen(port, () => {
    console.log(`Listening @ ${address}:${port}`);
});