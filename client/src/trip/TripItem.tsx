import React from "react";

interface TripItemProps {
    id?: string;
    destination: string;
    cost: number;
    date: string;
    completed: boolean
}

const TripItem: React.FC<TripItemProps> = ({id, destination, cost, date, completed}) => {
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