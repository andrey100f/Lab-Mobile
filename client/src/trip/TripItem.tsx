import React, {memo} from "react";
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
import {TripItemProps} from "./TripItemProps";

const log = getLogger("TripItem");

interface TripItemPropsExt extends TripItemProps {
    onEdit: (id?: string) => void;
}

const TripItem: React.FC<TripItemPropsExt> = ({id, destination, cost, date, completed, onEdit}) => {
    log(`render ${destination}, ${cost}, ${date}, ${completed}`);
    return (
        <IonCard onClick={() => onEdit(id)}>
            <IonCardHeader>
                <IonCardTitle>{destination}</IonCardTitle>
                <IonCardSubtitle>{date}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                <IonChip outline={true}>${cost}</IonChip>
                <IonChip color={completed ? "success" : "danger"} >{completed ? "Completed" : "Uncompleted"}</IonChip>
                {/*<IonChip color="secondary" onClick={() => onEdit(id)}>*/}
                {/*    <IonIcon slot="start" icon={pencil}></IonIcon>*/}
                {/*    Update*/}
                {/*</IonChip>*/}
                {/*<IonChip color="danger">*/}
                {/*    <IonIcon slot="start" icon={trash}></IonIcon>*/}
                {/*    Remove*/}
                {/*</IonChip>*/}
            </IonCardContent>
        </IonCard>
    );
};

export default memo(TripItem);