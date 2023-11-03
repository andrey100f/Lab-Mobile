const jwt = require("jsonwebtoken");

const jwtConfig = {secret: "my-secret"};

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.verify(token, jwtConfig.secret);
    return decodedToken.userId;
}

module.exports = {
    jwtConfig,
    getUserIdFromToken
};