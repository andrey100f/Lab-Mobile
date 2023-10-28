const {PrismaClient} = require("@prisma/client");
const jwt= require("jsonwebtoken");
const jwtConfig= require("../utils/jwt");

const prisma = new PrismaClient();

class UserService {
    loginUser = async (req, res) => {
        try {
            const loginData = req.body;

            const user = await prisma.users.findFirst({
                where: loginData
            });

            if(!user) {
                return res.status(404).json({message: "User not found..."});
            }

            return res.status(200).json({token: this.createToken(user)});
        }
        catch (err) {
            return res.status(400).json({message: err.message});
        }
    }

    createToken = (user) => {
        return jwt.sign({username: user.username, userId: user.userId}, jwtConfig.secret, {expiresIn: 60 * 60 * 60});
    }
}

module.exports = UserService;