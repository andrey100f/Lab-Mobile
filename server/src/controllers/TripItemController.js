const router = require("express").Router();
const TripItemService = require("../services/TripService");

router.get("/", TripItemService.getAllTripItems);
// router.get("/:userId", TripItemService.getTripItemsByUserId);
// router.get("/:userId/:tripId", TripItemService.getTripItemById);
// router.patch("/:userId/:tripId", TripItemService.updateTripItem);
// router.post("/:userId", TripItemService.createTripItem);
router.put("/:tripId", TripItemService.updateTripItem);
router.post("/", TripItemService.createTripItem);
router.get("/:tripId", TripItemService.getTripItemById);

module.exports = router;