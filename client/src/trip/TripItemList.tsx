import {
    IonButton, IonButtons, IonChip,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList,
    IonLoading,
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle, IonToast,
    IonToolbar,
} from "@ionic/react";
import TripItem from "./TripItem";
import {getLogger, formatDate} from "../utils";
import {add, fish} from "ionicons/icons";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {RouteComponentProps} from "react-router";
import {TripItemContext, TripItemProvider} from "./TripItemProvider";
import {useNetwork} from "../utils/useNetwork";
import {usePreferences} from "../utils/usePreferences";
import {TripItemProps} from "./TripItemProps";
import tripItem from "./TripItem";


const log = getLogger('TripItemList');

const TripItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {get, set} = usePreferences();
    const [token, setToken] = useState("");
    const [tripItems, setTripItems] = useState<TripItemProps[]>([]);

    let {fetching, fetchingError} = useContext(TripItemContext);
    const [filter, setFilter] = useState<string>("");
    const [searchDestination, setSearchDestination] = useState<string>("");
    const {networkStatus} = useNetwork();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getToken = async () => {
            const result = await get("loginToken");
            setToken(result!);
        };

        getToken();
    }, []);

    useEffect(() => {
        const getTripItems = async () => {
            const result = await get("tripItems");
            setTripItems(JSON.parse(result!));
        };

        getTripItems();
    }, []);

    log("render");

    const handleLogOut = async () => {
        await set("loginToken", "");
        window.location.href = "/login";
    }

    const getPaginatedTripItems = async () => {
        const tripItemsString = await get("tripItems");
        const newTripItems = JSON.parse(tripItemsString!).slice((currentPage - 1) * 5, currentPage * 5);
        if(newTripItems!.length > 0) {
            setTripItems([...tripItems, ...newTripItems]);
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        getPaginatedTripItems();
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot="start">Travel Management App</IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent>
                <IonItem>
                    <IonChip className="ion-margin-end" color={networkStatus.connected ? "success" : "danger"}>
                        {networkStatus.connected ? "Online" : "Offline"}</IonChip>

                    {networkStatus.connected && (
                        <IonChip>The data will be updated</IonChip>
                    )}

                    {!networkStatus.connected && (
                        <IonChip>The data will be saved locally</IonChip>
                    )}

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
                    <IonToast isOpen={true} className="ion-color-danger" position="bottom" duration={2000}
                              message={fetchingError.message || "Failed to fetch items"} ></IonToast>
                )}

                <IonInfiniteScroll
                    onIonInfinite={(ev) => {
                        setTimeout(() => {
                            getPaginatedTripItems();
                        }, 1000);
                        setTimeout(() => ev.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>

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