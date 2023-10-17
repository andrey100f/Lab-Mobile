import {useCallback, useEffect, useReducer, useState} from "react";
import {getLogger} from "../utils";
import {TripItemProps} from "./TripItemProps";
import {getTripItems, createTripItem} from "./tripItemApi";

const log = getLogger("useItems");

export interface TripItemsState {
    tripItems?: TripItemProps[];
    fetching: boolean;
    fetchingError?: Error;
}

export interface TripItemsProps extends TripItemsState {
    addTripItem: () => void;
}

interface ActionProps {
    type: string;
    payload?: any;
}

const initialState: TripItemsState = {
    tripItems: undefined,
    fetching: false,
    fetchingError: undefined
};

const FETCH_TRIP_ITEMS_STARTED = 'FETCH_TRIP_ITEMS_STARTED';
const FETCH_TRIP_ITEMS_SUCCESSFUL = 'FETCH_TRIP_ITEMS_SUCCESSFUL';
const FETCH_TRIP_ITEMS_FAILED = 'FETCH_TRIP_ITEMS_FAILED';
const ADD_TRIP_ITEM = 'ADD_TRIP_ITEM';

const reducer: (state: TripItemsState, action: ActionProps) => TripItemsState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_TRIP_ITEMS_STARTED:
                return {...state, fetching: true};
            case FETCH_TRIP_ITEMS_SUCCESSFUL:
                return {...state, tripItems: payload.tripItems, fetching: false};
            case FETCH_TRIP_ITEMS_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            case ADD_TRIP_ITEM:
                return {...state, tripItems: payload.tripItems};
            default:
                return state;
        }
    }

export const useTripItems: () => TripItemsProps = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tripItems, fetching, fetchingError} = state;

    const addTripItem = useCallback(async () => {
        try {
            log("addTripItem - started");
            const tripItem = await createTripItem();
            dispatch({type: ADD_TRIP_ITEM, payload: tripItems});
            getTripItemsEffect(); // ? it's ok this call to function?
            log("addTripItem - successful");
        }
        catch (error) {
            log("addTripItem - failed");
        }
    }, [tripItems]);

    useEffect(getTripItemsEffect, [dispatch]);
    log(`returns - fetching = ${fetching}. items=${JSON.stringify(tripItems)}`);

    return {
        tripItems,
        fetching,
        fetchingError,
        addTripItem
    };

    function getTripItemsEffect() {
        let canceled = false;
        fetchTripItems();
        return () => {
            canceled = true;
        }

        async function fetchTripItems() {
            try {
                log("fetchTripItems started");
                dispatch({type: FETCH_TRIP_ITEMS_STARTED});
                const tripItems = await getTripItems();
                log("fetchTripItems successful");
                if(!canceled) {
                    dispatch({type: FETCH_TRIP_ITEMS_SUCCESSFUL, payload: {tripItems}});
                }
            }
            catch (error) {
                log("fetchTripItems failed");
                if(!canceled) {
                    dispatch({type: FETCH_TRIP_ITEMS_FAILED, payload: {error}});
                }
            }
        }
    }
};