import {getLogger} from "../utils";
import {TripItemContext} from "./TripItemProvider";
import {TripItemProps} from "./TripItemProps";
import {RouteComponentProps} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime,
    IonDatetimeButton,
    IonHeader,
    IonInput, IonLoading, IonModal,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {useNetwork} from "../utils/useNetwork";
import {usePreferences} from "../utils/usePreferences";

const log = getLogger('tripItemEdit');

interface TripItemEditProps extends RouteComponentProps<{
    id?: string
}> {}

const TripItemEdit: React.FC<TripItemEditProps> = ({history, match}) => {
    const {networkStatus} = useNetwork();
    const {get} = usePreferences();
    const [tripItems, setTripItems] = useState<TripItemProps[]>([]);
    useEffect(() => {
        const getTripItems = async () => {
            const result = await get("tripItems");
            setTripItems(JSON.parse(result!));
        };

        getTripItems();
    }, []);

    const {saving, savingError, saveTripItem} = useContext(TripItemContext);
    const [destination, setDestination] = useState('');
    const [cost, setCost] = useState(0);
    const [completed, setCompleted] = useState("");
    const [tripDate, setTripDate] = useState(new Date().toISOString());
    const [tripItem, setTripItem] = useState<TripItemProps>();

    useEffect(() => {
        log('useEffect');

        const routeId = match.params.id || '';
        const tripItem = tripItems?.find(it => it.tripId === routeId);

        setTripItem(tripItem);

        if(tripItem) {
            setDestination(tripItem.destination);
            setCost(tripItem.cost);
            setCompleted(tripItem.completed);
            setTripDate(tripItem.tripDate);
        }
    }, [match.params.id, tripItems]);

    const handleSave = () => {
        const editedTripItem = tripItem ? {...tripItem, destination, cost, completed, tripDate} : {destination, cost, completed, tripDate};
        if(networkStatus) {
            saveTripItem && saveTripItem(editedTripItem).then(() => history.goBack());
        }
        else {
            history.goBack();
        }
    }

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonInput class="ion-margin" label="Destination" placeholder="Enter the destination" value={destination}
                          onIonChange={e => setDestination(e.detail.value || '')} />

                <IonInput class="ion-margin" label="Cost" type="number" placeholder="Enter the cost" value={cost}
                onIonChange={e => setCost(parseInt(e.detail.value ?? '0', 10) || 0)}/>

                <span className="ion-margin">Pick the date</span>
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                <IonModal keepContentsMounted={true}>
                    <IonDatetime id="datetime" presentation="date" value={tripDate}
                                 onIonChange={e => setTripDate(e.detail.value?.toString() || '')}>
                    </IonDatetime>
                </IonModal>

                <p className="ion-margin">Pick if the trip is completed or not</p>
                <IonRadioGroup value={completed.toString()} onIonChange={e => setCompleted(e.detail.value)}>
                    <IonRadio className="ion-margin" value="true" labelPlacement="end">Yes</IonRadio>
                    <IonRadio className="ion-margin" value="false" labelPlacement="end">No</IonRadio>
                </IonRadioGroup>

                <IonLoading isOpen={saving} />
                {savingError && (
                    <IonToast isOpen={true} className="ion-color-danger" position="bottom" duration={2000}
                              message={"Updates saved locally"} ></IonToast>
                )}
            </IonContent>
        </IonPage>
    );
}

export default TripItemEdit;