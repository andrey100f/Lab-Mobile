import {useCallback, useState} from "react";
import {getLogger} from "../utils";

const log = getLogger("useItems");

export interface TripItemProps {
    id?: string;
    destination: string;
    cost: number;
    date: string;
    completed: boolean;
}

export interface TripItemsProps {
    tripItems: TripItemProps[];
    addTripItem: () => void;
}

export const useTripItems: () => TripItemsProps = () => {
    const [tripItems, setTripItems] = useState([
        {
            id: "a1f3b5e7-59c8-4c0a-8b1f-1410c5d1f418",
            destination: "Paris, France",
            cost: 1000,
            date: "2023-11-01",
            completed: false
        },
        {
            id: "b2d4e6f8-69d7-5e1b-9a2f-2511c4d2e527",
            destination: "New York, USA",
            cost: 1500,
            date: "2023-12-15",
            completed: false
        },
        {
            id: "c3e5f7g9-79e8-6f2c-0b3a-3612c5d3f629",
            destination: "Tokyo, Japan",
            cost: 2000,
            date: "2024-02-28",
            completed: true
        },
        {
            id: "d4f6g8h0-89f1-7g3d-1c4e-4723c6d4e731",
            destination: "Sydney, Australia",
            cost: 1800,
            date: "2024-04-10",
            completed: false
        },
        {
            id: "e5g7h9i1-99j2-8h4g-2i1f-5832c7d5f842",
            destination: "Rome, Italy",
            cost: 1200,
            date: "2024-05-25",
            completed: true
        }
    ]);

    const addTripItem = useCallback(() => {
        const id = `${tripItems.length + 1}`;
        log("addTripItem");
        setTripItems(tripItems.concat({
            id: id,
            destination: "New destination",
            cost: 2002,
            date: "new date",
            completed: true
        }));
    }, [tripItems]);

    log("returns");
    return {
        tripItems,
        addTripItem,
    };
};