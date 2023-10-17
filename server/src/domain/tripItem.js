class TripItem {
    constructor(id, destination, cost, date, completed) {
        this.id = id;
        this.destination = destination;
        this.cost = cost;
        this.date = date;
        this.completed = completed;
    }
}

module.exports = TripItem;