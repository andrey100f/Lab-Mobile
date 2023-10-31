import axios from "axios";
import {authConfig, baseUrl,  getLogger, withLogs} from "../utils";
import {TripItemProps} from "./TripItemProps"

const tripItemUrl = `http://${baseUrl}/trips`;
const socketUrl = `localhost:8080`;

export const getTripItems: (token: string) => Promise<TripItemProps[]> = (token) => {
    return withLogs(axios.get(tripItemUrl, authConfig(token)), "getTripItems");
}

export const createTripItem: (token: string, tripItem: TripItemProps) => Promise<TripItemProps[]> = (token, tripItem) => {
    return withLogs(axios.post(tripItemUrl, tripItem, authConfig(token)), "createTripItem");
}

export const updateTripItem: (token: string, tripItem: TripItemProps) => Promise<TripItemProps[]> = (token, tripItem) => {
    return withLogs(axios.put(`${tripItemUrl}/${tripItem.tripId}`, tripItem, authConfig(token)), "updateTripItem");
}

interface MessageData {
    event: string;
    payload: {
        tripItem: TripItemProps;
    };
}

const log = getLogger('ws');

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${socketUrl}`)
    ws.onopen = () => {
        log('web socket onopen');
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror' + error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}