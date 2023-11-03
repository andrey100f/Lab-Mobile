const router = require("express").Router();

class UserController {
    constructor(userService) {
        this.userService = userService;
        this.router = router;
    }

    setRouter = () => {
        this.router.post("/login", this.userService.loginUser);
    }
}

module.exports = UserController;