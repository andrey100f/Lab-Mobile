const {PrismaClient} = require("@prisma/client");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../utils/jwt");
const prisma = new PrismaClient();

class TripItemService {
    constructor(socket) {
        this.socket = socket;
    }

    getAllTripItems = async (req, res) => {
        try {
            const tripItems = await prisma.trips.findMany();

            if(!tripItems) {
                return res.status(404).json({error: "No trips found..."});
            }

            setTimeout(() => {
                return res.status(200).json(tripItems);
            }, 1000);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    }

    getTripItemsByUserId = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = jwtConfig.getUserIdFromToken(token);

            const tripItems = await prisma.trips.findMany({
                where: {
                    userId: userId
                },
            });

            if(!tripItems) {
                return res.status(404).json({message: "Trips not found..."});
            }

            setTimeout(() => {
                return res.status(200).json(tripItems);
            }, 1000);

        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    }

    getTripItemById = async (req, res) => {
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
    }

    createTripItem = async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwtConfig.getUserIdFromToken(token);

        const tripId = req.params.tripId;
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

        setTimeout(() => {
            this.socket.broadcast(userId, { type: 'created', payload: tripItem });
            return res.status(200).json(tripItem);
        }, 1000);
    }

    updateTripItem = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, jwtConfig.jwtConfig.secret);
            const userId = decodedToken.userId;

            const tripId = req.params.tripId;
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

            setTimeout(() => {
                this.socket.broadcast(userId, { type: 'updated', payload: updatedTripItem });
                return res.status(200).json(updatedTripItem);
            }, 1000);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    }
}

module.exports = TripItemService;