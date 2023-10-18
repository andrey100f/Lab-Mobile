const express = require("express");
const router = express.Router();

class Controller {
    constructor(service) {
        this.service = service;
        this.router = router;
    }

    setRouter() {
        this.service.populateList();

        this.router.get("/trips", this.service.getAllTripItems);
        this.router.put("/trips/:id", this.service.updateTripItem);
        this.router.post("/trips", this.service.createTripItem);
    }
}

module.exports = Controller;