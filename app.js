const bp = require("body-parser");
const express = require("express");
const http = require("http");
const router = require("./routes");
const path = require("path");

const app = express();
const address = "0.0.0.0";
const port = 9000;

const server = http.createServer(app);

function formatIP(ip) {
    return ip.indexOf(":") >= 0 ? `[${ip}]` : ip;
}

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(function(request, response, next) {
    request.cip = formatIP(request.ip.replace(/^:{1,2}ffff:/, ''));
    next();
});

app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PATH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use("/test", router);

server.listen(port, () => {
    console.log(`Listening @ ${address}:${port}`);
});