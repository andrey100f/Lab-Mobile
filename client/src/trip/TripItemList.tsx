import {
    IonButton, IonChip,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList,
    IonLoading,
    IonPage, IonSearchbar, IonSelect, IonSelectOption,
    IonTitle, IonToast,
    IonToolbar,
    CreateAnimation, createAnimation
} from "@ionic/react";
import TripItem from "./TripItem";
import {getLogger, formatDate} from "../utils";
import {add} from "ionicons/icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import {RouteComponentProps} from "react-router";
import {TripItemContext} from "./TripItemProvider";
import {useNetwork} from "../utils/useNetwork";
import {usePreferences} from "../utils/usePreferences";
import {TripItemProps} from "./TripItemProps";
import "./styles/main.css";


const log = getLogger('TripItemList');


const TripItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {get, set} = usePreferences();
    const [token, setToken] = useState("");
    let {fetching, fetchingError, tripItems: tripItemsOnline} = useContext(TripItemContext);
    const [tripItems, setTripItems] = useState<TripItemProps[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [searchDestination, setSearchDestination] = useState<string>("");
    const {networkStatus} = useNetwork();
    const [currentPage, setCurrentPage] = useState(1);
    const animationRef = useRef<CreateAnimation>(null);

    useEffect(() => {
        const getToken = async () => {
            const result = await get("loginToken");
            setToken(result!);
        };

        getToken();
    }, []);

    useEffect(() => {
        const getTripItems = async () => {
            let result = await get("tripItems");
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

    useEffect(simpleAnimationJS, []);

    function simpleAnimationJS() {
        const el = document.querySelector("[data-title]");
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(5000)
                .direction("alternate")
                .iterations(Infinity)
                .keyframes([
                    { offset: 0, transform: "scale(3)", opacity: "1" },
                    { offset: 0.5, transform: "scale(1.5)", opacity: "1" },
                    {
                        offset: 1,
                        transform: "scale(0.5)",
                        opacity: "0.2",
                    },
                ]);
            animation.play();
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <CreateAnimation
                        ref={animationRef}
                        duration={5000}
                        fromTo={{
                            property: "transform",
                            fromValue: "translateY(0) rotate(0)",
                            toValue: `translateY(200px) rotate(180deg)`,
                        }}
                        easing="ease-out"
                    >
                        <IonTitle data-title slot="start">Travel Management App</IonTitle>
                    </CreateAnimation>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonItem>
                    <IonChip className="ion-margin-end data-chip" color={networkStatus.connected ? "success" : "danger"}>
                        {networkStatus.connected ? "Online" : "Offline"}</IonChip>

                    {networkStatus.connected && (
                        <IonChip className="data-chip">The data will be updated</IonChip>
                    )}

                    {!networkStatus.connected && (
                        <IonChip className="data-chip" data-chip>The data will be saved locally</IonChip>
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
                            .map(({tripId, destination, cost, tripDate, completed, latitude, longitude}) =>
                            <TripItem key={tripId} tripId={tripId} destination={destination} cost={cost} tripDate={formatDate(tripDate)} completed={completed}
                                      latitude={latitude} longitude={longitude} onEdit={tripId => history.push(`/trip/${tripId}`)}/> )}
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