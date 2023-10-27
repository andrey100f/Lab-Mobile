const express = require("express");
const cors = require("cors");

const TripItemController = require("./controllers/TripItemController");
const UserController = require("./controllers/UserController");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:8100"
}));

app.use("/trips", TripItemController);
app.use("/api/auth", UserController);

app.listen(3000, () => {
    console.log("REST API running on http://localhost:3000");
});