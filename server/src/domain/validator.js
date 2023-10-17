class Validator {
    validateTripItem(tripItem) {
        let errorMessages = [];
        if(!tripItem.destination) {
            errorMessages.push("Destination cannot be null!!");
        }
        if(tripItem.cost < 0) {
            errorMessages.push("Cost cannot be a negative number!!");
        }

        if(errorMessages.length > 0) {
            throw new Error(errorMessages.join("\m"));
        }
    }
}

module.exports = Validator;