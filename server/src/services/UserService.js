const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const UserService = {
    loginUser: async (req, res) => {
        try {
            const loginData = req.body;

            const user = await prisma.users.findFirst({
                where: loginData
            });

            if(!user) {
                return res.status(404).json({message: "User not found..."});
            }

            return res.status(200).json(user);
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    },
};

module.exports = UserService;