const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const router = express.Router();

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:8100"
}));

app.listen(3000, () => {
    console.log("REST API server ready at: http://localhost:3000");
});

class Validator {
    validateTripItem(tripItem) {
        let errorMessages = [];
        if(!tripItem.destination) {
            errorMessages.push("Destination cannot be null!!");
        }
        if(tripItem.cost < 0) {
            errorMessages.push("Cost cannot be a negative number!!");
        }

        if(errorMessages.length > 0) {
            throw new Error(errorMessages.join("\m"));
        }
    }
}

class TripItem {
    constructor(id, destination, cost, date, completed) {
        this.id = id;
        this.destination = destination;
        this.cost = cost;
        this.date = date;
        this.completed = completed;
    }
}

const validator = new Validator();
let tripItems = [];

const getTripItemValues = () => {
    let destinations = ["Bali, Indonesia", "Santorini, Greece", "New York City, USA", "Tokyo, Japan",
        "Sydney, Australia", "Rome, Italy", "Cancun, Mexico", "Cape Town, South Africa", "Paris, France",
        "Bangkok, Thailand"];
    let completedValues = [true, false];

    let id = uuid.v4();
    let destination = destinations[Math.floor(Math.random() * 10)];
    let cost = Math.floor(Math.random() * 1000);
    let completed = completedValues[Math.floor(Math.random() * 2)];

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let formattedDate = day + "-" + month + "-" + year;

    return new TripItem(id, destination, cost, formattedDate, completed);
}

const populateList = () => {
    for(let i = 0; i < 5; i++) {
        const tripItem = getTripItemValues();
        tripItems.push(tripItem);
    }
}

const getAllTripItems = (request, response) => {
    setTimeout(() => {
        return response.status(200).json(tripItems);
    }, 1000);
}

const createTripItem = (request, response) => {
    const tripItem = getTripItemValues();
    tripItems.push(tripItem);

    return response.status(200).json(tripItem);
}

const updateTripItem = (request, response) => {
    const tripItem = request.body;
    try {
        validator.validateTripItem(tripItem);
        for(let trip in tripItems) {
            if(trip.id === tripItem.id) {
                trip = tripItem;
                break;
            }
        }

        return response.status(200).json(tripItem);
    }
    catch (error) {
        return response.status(500).json({error: error.message});
    }
}

populateList();

router.get("/trips", getAllTripItems);
router.put("/trips/:id", updateTripItem);
router.post("/trips", createTripItem);

app.use("/", router);
