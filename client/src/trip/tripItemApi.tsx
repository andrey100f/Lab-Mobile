import axios from "axios";
import {getLogger} from "../utils";
import {TripItemProps} from "./TripItemProps"

const log = getLogger("tripItemApi");

const baseUrl = "http://localhost:3000";
const tripItemUrl = `${baseUrl}/trips`;

interface ResponseProps<T> {
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getTripItems: () => Promise<TripItemProps[]> = () => {
    return withLogs(axios.get(tripItemUrl, config), 'getTripItems');
}

export const createTripItem: (tripItem: TripItemProps) => Promise<TripItemProps[]> = tripItem => {
    return withLogs(axios.post(tripItemUrl, tripItem, config), 'createTripItem');
}

export const updateTripItem: (tripItem: TripItemProps) => Promise<TripItemProps[]> = tripItem => {
    return withLogs(axios.put(`${tripItemUrl}/${tripItem.id}`, tripItem, config), 'updateTripItem');
}