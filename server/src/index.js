const express = require("express");
const cors = require("cors");

const Service = require ("./services/service.js");
const Controller = require("./controllers/controller.js");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:8100"
}));

app.listen(3000, () => {
    console.log("REST API server ready at: http://localhost:3000");
});

const service = new Service();
const controller = new Controller(service);
controller.setRouter();

app.use("/", controller.router);
