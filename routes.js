const router = require("express").Router();
const math = require("./math");
const axios = require("axios");

const lights = {};
let lightIndex = 0;

function objectToArray(obj) {
    let arr = [];
    for (const key in obj)
        arr.push(obj[key]);
    return arr;
}

router.get("/fib/:num", function(request, response) {
    let num = +request.params.num;
    response.json({ result: math.fib(num) });
});

router.get("/average/:nums", function(request, response) {
    let nums = request.params.nums.split(",").map(n => +n);
    
    response.json({ result: math.average(nums) });
});

router.get("/median/:nums", function(request, response) {
    let nums = request.params.nums.split(",").map(n => +n);

    response.json({ result: math.median(nums) });
});

router.post("/light", function(request, response) {
    const light = {
        applianceId: ++lightIndex,
        manufacturerName: 'Smiley',
        modelName: 'MFR',
        version: '04',
        friendlyName: 'Desk Light',
        friendlyDescription: 'Lamp on the living room floor',
        isReachable: true,
        actions: [
            "turnOn",
            "turnOff"
        ],
        additionalApplianceDetails: {
            ip: request.cip,
            on: false
        }
    };

    lights[lightIndex] = light;

    response.json({ success: true, light: light });
});

router.post("/on", function(request, response) { response.status(200).end(); });
router.post("/off", function(request, response) { response.status(200).end(); });

router.post("/light/:id/off", function(request, response) {
    const light = lights[request.params.id];

    if (!light) {
        response.json({ speechResponse: "I'm sorry, I couldn't find the light you requested." });
        return;
    }

    axios.get(`http://${light.additionalApplianceDetails.ip}:5000/off`)
        .then(r => {
            response.json({ speechResponse: "The light is off." });
            light.additionalApplianceDetails.on = false;
        })
        .catch(err => {
            response.json({ speechResponse: "I'm sorry, something went wrong." });
        });
});

router.post("/light/:id/on", function(request, response) {
    const light = lights[request.params.id];
    
    if (!light) {
        response.json({ speechResponse: "I'm sorry, I couldn't find the light you requested." });
        return;
    }

    const endpoint = `http://${light.additionalApplianceDetails.ip}:5000/on`;
    console.log(endpoint);
    axios.get(endpoint)
        .then(r => {
            response.json({ speechResponse: "The light is on." });
            light.additionalApplianceDetails.on = true;
        })
        .catch(err => {
            response.json({ speechResponse: "I'm sorry, something went wrong." });
        });
});

router.get("/lights", function(request, response) {
    response.json(objectToArray(lights));
});

router.delete("/light/:id", function(request, response) {
    delete lights[request.params.id];
    response.json({ success: true });
});

module.exports = router;