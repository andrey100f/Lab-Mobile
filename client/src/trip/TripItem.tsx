import React from "react";
import {getLogger} from "../utils";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonIcon
} from "@ionic/react";
import {pencil, trash} from "ionicons/icons";

const log = getLogger('TripItem');

interface TripItemProps {
    id?: string;
    destination: string;
    cost: number;
    date: string;
    completed: boolean;
}

const TripItem: React.FC<TripItemProps> = ({id, destination, cost, date, completed}) => {
    log(`render ${destination}, ${cost}, ${date}, ${completed}`);
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>{destination}</IonCardTitle>
                <IonCardSubtitle>{date}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                <IonChip color={completed ? "success" : "danger"} >{completed ? "Completed" : "Uncompleted"}</IonChip>
                <br/>
                <IonButton color="secondary">
                    <IonIcon slot="start" icon={pencil}></IonIcon>
                    Update
                </IonButton>
                <IonButton color="danger">
                    <IonIcon slot="start" icon={trash}></IonIcon>
                    Remove
                </IonButton>
            </IonCardContent>
        </IonCard>
    );
};

export default TripItem;