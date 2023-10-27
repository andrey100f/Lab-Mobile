const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const TripItemService = {
    getAllTripItems: async (req, res) => {
        try {
            const tripItems = await prisma.trips.findMany();

            if(!tripItems) {
                return res.status(404).json({error: "No trips found..."});
            }

            return res.status(200).json(tripItems);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    },

    getTripItemsByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            const tripItems = await prisma.trips.findMany({
                where: {
                    userId: userId
                }
            });

            if(!tripItems) {
                return res.status(404).json({message: "Trips not found..."});
            }

            return res.status(200).json(tripItems);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    },

    getTripItemById: async (req, res) => {
        try {
            const tripItemId = req.params.tripId;

            const tripItem = await prisma.trips.findFirst({
                where: {
                    tripId: tripItemId
                }
            });

            if(!tripItem) {
                return res.status(404).json({message: "No trip found..."});
            }

            return res.status(200).json(tripItem);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    },

    createTripItem: async (req, res) => {
        const tripId = req.params.tripId;
        const userId = "ac2d3eb7-2788-4911-9e78-43aa63a95358";
        const {destination, cost, tripDate, completed} = req.body;
        const date = new Date(tripDate);
        const tripItemData = {
            tripId: tripId,
            userId: userId,
            destination: destination,
            cost: cost,
            tripDate: date.toISOString(),
            completed: completed
        };

        const tripItem = await prisma.trips.create({
            data: tripItemData
        });

        return res.status(200).json(tripItem);
    },

    updateTripItem: async (req, res) => {
        try {
            const tripId = req.params.tripId;
            const userId = "ac2d3eb7-2788-4911-9e78-43aa63a95358";
            const {destination, cost, tripDate, completed} = req.body;
            const date = new Date(tripDate);
            const tripItemData = {
                tripId: tripId,
                userId: userId,
                destination: destination,
                cost: cost,
                tripDate: date.toISOString(),
                completed: completed
            };

            const tripItem = await prisma.trips.findFirst({
                where: {
                    tripId: tripId
                }
            });

            if(!tripItem) {
                return res.status(404).json({message: "No trip found..."});
            }

            const updatedTripItem = await prisma.trips.update({
                where: {
                    tripId: tripId
                },
                data: tripItemData
            });

            return res.status(200).json(updatedTripItem);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    },
};

module.exports = TripItemService;