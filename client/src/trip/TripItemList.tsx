import {
    IonButton, IonButtons, IonChip,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList,
    IonLoading,
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import TripItem from "./TripItem";
import {getLogger, formatDate} from "../utils";
import {add, fish} from "ionicons/icons";
import React, {useContext, useMemo, useState} from "react";
import {RouteComponentProps} from "react-router";
import {TripItemContext, TripItemProvider} from "./TripItemProvider";
import {getTripItems} from "./tripItemApi";
import {AuthContext} from "../auth";
import {useNetwork} from "../utils/useNetwork";


const log = getLogger('TripItemList');

const TripItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {token} = useContext(AuthContext);
    let {tripItems, fetching, fetchingError} = useContext(TripItemContext);
    const [filter, setFilter] = useState<string>("");
    const [searchDestination, setSearchDestination] = useState<string>("");
    const {networkStatus} = useNetwork();

    log("render");

    const handleLogOut = () => {
        log("logout");
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot="start">Travel Management App</IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent>
                <IonItem>
                    <IonChip className="ion-margin-start" color={networkStatus.connected ? "success" : "danger"} >{networkStatus.connected ? "Online" : "Offline"}</IonChip>
                    <IonButton className="ion-margin-end" slot="end" color="danger" size="small" fill="outline"
                               shape="round" onClick={handleLogOut}>Log Out</IonButton>
                </IonItem>
                <IonSearchbar value={searchDestination} debounce={500} onIonChange={e => setSearchDestination(e.detail.value!)} />
                <IonSelect className="ion-margin" value={filter} placeholder="Select if the trip is completed" onIonChange={e => setFilter(e.detail.value)}>
                    <IonSelectOption key="completed" value="true">Completed</IonSelectOption>
                    <IonSelectOption key="uncompleted" value="false" >Uncompleted</IonSelectOption>
                </IonSelect>

                <IonLoading isOpen={fetching} message="Fetching Items" />
                {tripItems && (
                    <IonList>
                        {tripItems
                            .filter(tripItem =>
                                (!filter || tripItem.completed === filter) &&
                                tripItem.destination.toLowerCase().indexOf(searchDestination.toLowerCase()) >= 0)
                            .map(({tripId, destination, cost, tripDate, completed}) =>
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