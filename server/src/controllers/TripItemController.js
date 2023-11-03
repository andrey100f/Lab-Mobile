const router = require("express").Router();

class TripItemController {
    constructor(tripItemService) {
        this.tripItemService = tripItemService;
        this.router = router;
    }

    setRouter = () => {
        // this.router.get("/", this.tripItemService.getAllTripItems);
        this.router.get("/", this.tripItemService.getTripItemsByUserId);
        this.router.get("/:tripId", this.tripItemService.getTripItemById);
        this.router.put("/:tripId", this.tripItemService.updateTripItem);
        this.router.post("/", this.tripItemService.createTripItem);
        // this.router.put("/:tripId", this.tripItemService.updateTripItem);
        // this.router.post("/", this.tripItemService.createTripItem);
        // this.router.get("/:tripId", this.tripItemService.getTripItemById);
    }
}

module.exports = TripItemController;