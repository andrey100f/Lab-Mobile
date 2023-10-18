const Validator = require("../domain/validator.js");
const TripItem = require("../domain/tripItem.js");

const WebSocket = require("ws");

class Service {
    constructor(wss) {
        this.tripItems = [];
        this.validator = new Validator();
        this.wss = wss;
    }

    formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return day + "-" + month + "-" + year;
    }

    getTripItemValues = () => {
        let destinations = ["Bali, Indonesia", "Santorini, Greece", "New York City, USA", "Tokyo, Japan",
            "Sydney, Australia", "Rome, Italy", "Cancun, Mexico", "Cape Town, South Africa", "Paris, France",
            "Bangkok, Thailand"];
        let completedValues = [true, false];

        let destination = destinations[Math.floor(Math.random() * 10)];
        let cost = Math.floor(Math.random() * 1000);
        let completed = completedValues[Math.floor(Math.random() * 2)];

        let date = new Date();
        let formattedDate = this.formatDate(date);

        return new TripItem(destination, cost, formattedDate, completed);
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
        const {destination, cost, date, completed} = request.body;
        const tripItem = new TripItem(destination, cost, date, completed);
        this.tripItems.push(tripItem);

        setTimeout(() => {
            this.broadcast({ event: 'created', payload: { tripItem } });
            return response.status(200).json(tripItem);
        }, 1000);
    }

    updateTripItem = (request, response) => {
        const tripItem = request.body;
        try {
            this.validator.validateTripItem(tripItem);
            for(let i = 0; i < this.tripItems.length; i++) {
                if(this.tripItems[i].id === tripItem.id) {
                    this.tripItems[i] = tripItem;
                    break;
                }
            }

            setTimeout(() => {
                this.broadcast({ event: 'updated', payload: { tripItem } });
                return response.status(200).json(tripItem);
            }, 1000);
        }
        catch (error) {
            return response.status(500).json({error: error.message});
        }
    }

    broadcast = data =>
        this.wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        })
}

module.exports = Service;