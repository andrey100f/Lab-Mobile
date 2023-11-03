import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import PropTypes from "prop-types";
import {getLogger} from "../utils";
import {TripItemProps} from "./TripItemProps";
import {createTripItem, getTripItems, updateTripItem, newWebSocket} from "./tripItemApi";
import {AuthContext} from "../auth";
import {usePreferences} from "../utils/usePreferences";
import {useNetwork} from "../utils/useNetwork";
import {save} from "ionicons/icons";

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
                return { ...state, tripItems: payload.tripItems, fetching: false, saving: false };
            case FETCH_TRIP_ITEMS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false, saving: false };
            case SAVE_TRIP_ITEMS_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_TRIP_ITEMS_SUCCEEDED:
                const tripItems = [...(state.tripItems || [])];
                const tripItem = payload.tripItem;
                const index = tripItems.findIndex(it => it.tripId === tripItem.tripId);

                if (index === -1) {
                    tripItems.push(tripItem);
                } else {
                    tripItems[index] = tripItem;
                }

                return { ...state, tripItems, saving: false, fetching: false };
            case SAVE_TRIP_ITEMS_FAILED:
                return { ...state, savingError: payload.error, saving: false, fetching: false };
            default:
                return state;
        }
};

export const TripItemContext = React.createContext<TripItemState>(initialState);

interface TripItemProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TripItemProvider: React.FC<TripItemProviderProps> = ({children}) => {
    const [tripItems, setTripItems] = useState<TripItemProps[]>([]);
    useEffect(() => {
        const getTripItems = async () => {
            const result = await get("tripItems");
            setTripItems(JSON.parse(result!));
        };

        getTripItems();
    }, []);

    const [state, dispatch] = useReducer(reducer, initialState);
    const {fetching, fetchingError, saving, savingError} = state;
    const {get, set} = usePreferences();
    const {networkStatus} = useNetwork();

    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const getToken = async () => {
            const result = await get("loginToken");
            setToken(result!);
        };

        getToken();
    }, []);

    useEffect(getTripItemsEffect, [token]);
    useEffect(wsEffect, [token]);

    const saveTripItem = useCallback<SaveTripItemFn>(saveTripItemCallback, [token]);
    const value = {fetching, fetchingError, saving, savingError, saveTripItem};

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

                if(networkStatus) {
                //     if(!tripItems) {
                //         const tripItems = await getTripItems(token);
                //         await set("tripItems", JSON.stringify(tripItems));
                //     }
                //     else {
                //         tripItems.forEach(tripItem => {
                //             if(tripItem.tripId) {
                //                 updateTripItem(token, tripItem);
                //             }
                //             else {
                //                 createTripItem(token, tripItem);
                //             }
                //         });
                //         await set("tripItems", JSON.stringify(tripItems));
                //     }


                    const tripItemsToken = await getTripItems(token);
                    if(tripItemsToken[0].tripId !== tripItems[0].tripId) {
                        await set("tripItems", JSON.stringify(tripItemsToken));
                    }
                    else {
                        tripItems.forEach(tripItem => {
                            if(tripItem.tripId) {
                                updateTripItem(token, tripItem);
                            }
                            else {
                                createTripItem(token, tripItem);
                            }
                        });
                        await set("tripItems", JSON.stringify(tripItems));
                    }

                }

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

            const index = tripItems.findIndex(it => it.tripId === tripItem.tripId);
            if (index === -1) {
                tripItems.push(tripItem);
            } else {
                tripItems[index] = tripItem;
            }
            await set("tripItems", JSON.stringify(tripItems));

            if(networkStatus) {
                const savedTripItem = await (tripItem.tripId ? updateTripItem(token!, tripItem) : createTripItem(token!, tripItem));
                dispatch({ type: SAVE_TRIP_ITEMS_SUCCEEDED, payload: { tripItem: savedTripItem } });
            }
            else {
                dispatch({ type: SAVE_TRIP_ITEMS_SUCCEEDED, payload: { tripItem: tripItems } });
            }

            log("saveTripItem succeeded");

        }
        catch (error) {
            log("saveTripItem failed");
            dispatch({type: SAVE_TRIP_ITEMS_FAILED, payload: {error}});
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: tripItem } = message;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_TRIP_ITEMS_SUCCEEDED, payload: { tripItem } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};

