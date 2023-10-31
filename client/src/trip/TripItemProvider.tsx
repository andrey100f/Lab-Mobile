import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import PropTypes from "prop-types";
import {getLogger} from "../utils";
import {TripItemProps} from "./TripItemProps";
import {createTripItem, getTripItems, updateTripItem, newWebSocket} from "./tripItemApi";
import {AuthContext} from "../auth";

const log = getLogger("TripItemProvider");

type SaveTripItemFn = (tripItem: TripItemProps) => Promise<any>;

export interface TripItemState {
    tripItems?: TripItemProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveTripItem?: SaveTripItemFn,
}

interface ActionProps {
    type: string,
    payload?: any
}

const initialState: TripItemState = {
    fetching: false,
    saving: false,
};

const FETCH_TRIP_ITEMS_STARTED = "FETCH_TRIP_ITEMS_STARTED";
const FETCH_TRIP_ITEMS_SUCCEEDED = "FETCH_TRIP_ITEMS_SUCCEEDED";
const FETCH_TRIP_ITEMS_FAILED = "FETCH_TRIP_ITEMS_FAILED";
const SAVE_TRIP_ITEMS_STARTED = "FETCH_TRIP_ITEMS_STARTED";
const SAVE_TRIP_ITEMS_SUCCEEDED = "SAVE_TRIP_ITEMS_SUCCEEDED";
const SAVE_TRIP_ITEMS_FAILED = "SAVE_TRIP_ITEMS_FAILED";

const reducer: (state: TripItemState, action: ActionProps) => TripItemState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_TRIP_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_TRIP_ITEMS_SUCCEEDED:
                return { ...state, tripItems: payload.tripItems, fetching: false };
            case FETCH_TRIP_ITEMS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_TRIP_ITEMS_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_TRIP_ITEMS_SUCCEEDED:
                const tripItems = [...(state.tripItems || [])];
                const tripItem = payload.tripItem;
                const index = tripItems.findIndex(it => it.tripId === tripItem.tripId);

                if (index === -1) {
                    tripItems.splice(0, 0, tripItem);
                } else {
                    tripItems[index] = tripItem;
                }

                return { ...state, tripItems, saving: false };
            case SAVE_TRIP_ITEMS_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
};

export const TripItemContext = React.createContext<TripItemState>(initialState);

interface TripItemProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TripItemProvider: React.FC<TripItemProviderProps> = ({children}) => {
    const {token} = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tripItems, fetching, fetchingError, saving, savingError} = state;

    useEffect(getTripItemsEffect, [token]);
    useEffect(wsEffect, [token]);

    const saveTripItem = useCallback<SaveTripItemFn>(saveTripItemCallback, [token]);
    const value = {tripItems, fetching, fetchingError, saving, savingError, saveTripItem};

    log("returns");

    return (
      <TripItemContext.Provider value={value}>
          {children}
      </TripItemContext.Provider>
    );

    function getTripItemsEffect() {
        let canceled = false;

        if(token) {
            fetchTripItems();
        }

        return () => {
            canceled = true;
        }

        async function fetchTripItems() {
            try {

                log("fetchTripItems started");

                dispatch({type: FETCH_TRIP_ITEMS_STARTED});

                const tripItems = await getTripItems(token);

                log("fetchTripItems succeeded");

                if(!canceled) {
                    dispatch({type: FETCH_TRIP_ITEMS_SUCCEEDED, payload: {tripItems}});
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

    async function saveTripItemCallback(tripItem: TripItemProps) {
        try {
            log("saveTripItem started");
            dispatch({type: SAVE_TRIP_ITEMS_STARTED});

            const savedTripItem = await(tripItem.tripId ? updateTripItem(token, tripItem): createTripItem(token, tripItem));

            log("saveTripItem succeeded");
            dispatch({type: SAVE_TRIP_ITEMS_SUCCEEDED, payload: {tripItem: savedTripItem}});
            getTripItemsEffect();
        }
        catch (error) {
            log("saveTripItem failed");
            dispatch({type: SAVE_TRIP_ITEMS_FAILED, payload: {error}});
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');

        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }
            const { event, payload: { tripItem }} = message;
            log(`ws message, item ${event}`);
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_TRIP_ITEMS_SUCCEEDED, payload: { tripItem } });
            }
        });
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket();
        }
    }
};

