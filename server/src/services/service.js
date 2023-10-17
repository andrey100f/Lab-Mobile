const uuid = require("uuid");
const Validator = require("../domain/validator.js");
const TripItem = require("../domain/tripItem.js");

class Service {
    constructor() {
        this.tripItems = [];
        this.validator = new Validator();
    }

    getTripItemValues = () => {
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

    populateList = () => {
        for(let i = 0; i < 5; i++) {
            const tripItem = this.getTripItemValues();
            this.tripItems.push(tripItem);
        }
    }

    getAllTripItems = (request, response) => {
        setTimeout(() => {
            return response.status(200).json(this.tripItems);
        }, 1000);
    }

    createTripItem = (request, response) => {
        const tripItem = this.getTripItemValues();
        this.tripItems.push(tripItem);

        return response.status(200).json(tripItem);
    }

    updateTripItem = (request, response) => {
        const tripItem = request.body;
        try {
            this.validator.validateTripItem(tripItem);
            for(let trip in this.tripItems) {
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
}

module.exports = Service;