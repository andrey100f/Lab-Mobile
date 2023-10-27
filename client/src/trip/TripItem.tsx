import React, {memo} from "react";
import {getLogger} from "../utils";
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
} from "@ionic/react";
import {TripItemProps} from "./TripItemProps";

const log = getLogger("TripItem");

interface TripItemPropsExt extends TripItemProps {
    onEdit: (tripId?: string) => void;
}

const TripItem: React.FC<TripItemPropsExt> = ({tripId, destination, cost, tripDate, completed, onEdit}) => {
    log(`render ${destination}, ${cost}, ${tripDate}, ${completed}`);
    return (
        <IonCard onClick={() => onEdit(tripId)}>
            <IonCardHeader>
                <IonCardTitle>{destination}</IonCardTitle>
                <IonCardSubtitle>{tripDate}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                <IonChip outline={true}>${cost}</IonChip>
                <IonChip color={completed === "true" ? "success" : "danger"} >{completed === "true" ? "Completed" : "Uncompleted"}</IonChip>
            </IonCardContent>
        </IonCard>
    );
};

export default memo(TripItem);