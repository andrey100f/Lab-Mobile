import React from "react";
import {getLogger} from "../utils";

const log = getLogger('TripItem');

interface TripItemProps {
    id?: string;
    destination: string;
    cost: number;
    date: string;
    completed: boolean
}

const TripItem: React.FC<TripItemProps> = ({id, destination, cost, date, completed}) => {
    log(`render ${destination}, ${cost}, ${date}, ${completed}`);
    return (
        <div>
            <div>
                <p>Destination: {destination}</p>
                <p>Cost: {cost}</p>
                <p>Date: {date}</p>
                <p>Completed: {completed ? "Yes" : "No"}</p>
            </div>
            <hr/>
        </div>
    );
};

export default TripItem;