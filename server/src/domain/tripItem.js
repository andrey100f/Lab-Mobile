const uuid = require("uuid");

class TripItem {
    constructor(destination, cost, date, completed) {
        this.id = uuid.v4();
        this.destination = destination;
        this.cost = cost;
        this.date = date;
        this.completed = completed;
    }
}

module.exports = TripItem;