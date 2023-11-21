const express = require("express");
const cors = require("cors");

const WebSocket = require("ws");

const TripItemController = require("./controllers/TripItemController");
const UserController = require("./controllers/UserController");
const TripItemService = require("./services/TripService");
const UserService = require("./services/UserService");

const Socket = require("./utils/socket");

const app = express();
const wss = new WebSocket.Server({port: 8000});
const socket = new Socket(wss);
socket.initWss();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:8100"
}));

app.listen(3000, () => {
    console.log("REST API running on http://localhost:3000");
});

const tripItemService = new TripItemService(socket);
const tripItemController = new TripItemController(tripItemService);
tripItemController.setRouter();

const userService = new UserService();
const userController = new UserController(userService);
userController.setRouter();

app.use("/trips", tripItemController.router);
app.use("/auth", userController.router);
