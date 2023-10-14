import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import TripItem from "./TripItem";
import {getLogger} from "../utils";
import {add} from "ionicons/icons";
import {useTripItems} from "./useTripItems";
import React from "react";

const log = getLogger('TripItemList');

const TripItemList: React.FC = () => {
   const {tripItems, fetching, fetchingError, addTripItem} = useTripItems();
    log("render");

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Travel Management App</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching Items" />
                {tripItems && (
                    <IonList>
                        {tripItems.map(({id, destination, cost, date, completed}) =>
                            <TripItem key={id} destination={destination} cost={cost} date={date} completed={completed} /> )}
                    </IonList>
                )}

                {fetchingError && (
                    <div>{fetchingError.message || "Failed to fetch items"}</div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={addTripItem}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default TripItemList;