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
import {getLogger, formatDate} from "../utils";
import {add} from "ionicons/icons";
import React, {useContext} from "react";
import {RouteComponentProps} from "react-router";
import {TripItemContext} from "./TripItemProvider";

const log = getLogger('TripItemList');

const TripItemList: React.FC<RouteComponentProps> = ({history}) => {
   const {tripItems, fetching, fetchingError} = useContext(TripItemContext);
   log(fetching);
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
                        {tripItems.map(({tripId, destination, cost, tripDate, completed}) =>
                            <TripItem key={tripId} tripId={tripId} destination={destination} cost={cost} tripDate={formatDate(tripDate)} completed={completed}
                            onEdit={tripId => history.push(`/trip/${tripId}`)}/> )}
                    </IonList>
                )}

                {fetchingError && (
                    <div>{fetchingError.message || "Failed to fetch items"}</div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/trip')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default TripItemList;