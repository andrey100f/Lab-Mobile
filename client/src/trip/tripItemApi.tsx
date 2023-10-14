import axios from "axios";
import {getLogger} from "../utils";
import {TripItemProps} from "./TripItemProps"

const log = getLogger("tripItemApi");
const baseUrl = "http://localhost:3000";

export const getTripItems: () => Promise<TripItemProps[]> = async () => {
    log("getTripItems - started");
    return axios
        .get(`${baseUrl}/trips`)
        .then(response => {
            log("getTripItems - successful");
            return Promise.resolve(response.data);
        })
        .catch(error => {
            log("getTripItems - failed");
            return Promise.reject(error);
        });
}

export const createTripItem: () => Promise<TripItemProps> = async () => {
    log("addTripItem - started");
    return axios
        .post(`${baseUrl}/trips`)
        .then(response => {
            log("createTripItem - successful");
            return Promise.resolve(response.data);
        })
        .catch(error => {
            log("addTripItems - failed");
            return Promise.reject(error);
        })
}