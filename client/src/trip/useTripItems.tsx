import {useCallback, useEffect, useState} from "react";
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

export const useTripItems: () => TripItemsProps = () => {
    const [fetching, setFetching] = useState<boolean>(false);
    const [tripItems, setTripItems] = useState<TripItemProps[]>();
    const [fetchingError, setFetchingError] = useState<Error>();

    const addTripItem = useCallback(async () => {
        log("addTripItem - TODO");
        try {
            log("addTripItem - started");
            const tripItem = await createTripItem();
            setTripItems(tripItems?.concat(tripItem));
            log("addTripItem - successful");
        } catch (error) {
            log("addTripItem - failed");
        }
    }, [tripItems]);

    useEffect(getTripItemsEffect, []);
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
                setFetching(true);
                const tripItems = await getTripItems();
                log("fetchTripItems successful");
                if(!canceled) {
                    setFetching(false);
                    setTripItems(tripItems);
                }
            }
            catch (error) {
                log("fetchTripItems failed");
                if(!canceled) {
                    setFetching(false);
                    setFetchingError(error as Error);
                }
            }
        }
    }
};