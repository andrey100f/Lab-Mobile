import {getLogger} from "../utils";
import {formatDate} from "../utils";
import {TripItemContext} from "./TripItemProvider";
import {TripItemProps} from "./TripItemProps";
import {RouteComponentProps} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime,
    IonDatetimeButton,
    IonHeader,
    IonInput, IonLoading, IonModal,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";

const log = getLogger('tripItemEdit');

interface TripItemEditProps extends RouteComponentProps<{
    id?: string
}> {}

const TripItemEdit: React.FC<TripItemEditProps> = ({history, match}) => {
    const {tripItems, saving, savingError, saveTripItem} = useContext(TripItemContext);
    const [destination, setDestination] = useState('');
    const [cost, setCost] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [date, setDate] = useState('');
    const [tripItem, setTripItem] = useState<TripItemProps>();

    useEffect(() => {
        log('useEffect');

        const routeId = match.params.id || '';
        const tripItem = tripItems?.find(it => it.id === routeId);

        setTripItem(tripItem);

        if(tripItem) {
            setDestination(tripItem.destination);
            setCost(tripItem.cost);
            setCompleted(tripItem.completed);
            setDate(tripItem.date);
        }
    }, [match.params.id, tripItems]);

    const handleSave = useCallback(() => {
        const editedTripItem = tripItem ? {...tripItem, destination, cost, completed, date} : {destination, cost, completed, date};
        saveTripItem && saveTripItem(editedTripItem).then(() => history.goBack());
    }, [tripItem, saveTripItem, destination, cost, completed, date, history]);

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
                    <IonDatetime id="datetime" presentation="date" onIonChange={e => setDate(formatDate(e.detail.value?.toString() || ''))}>
                    </IonDatetime>
                </IonModal>

                <p className="ion-margin">Pick if the trip is completed or not</p>
                <IonRadioGroup value={completed} onIonChange={e => setCompleted(e.detail.value)}>
                    <IonRadio className="ion-margin" value={true} labelPlacement="end">Yes</IonRadio>
                    <IonRadio className="ion-margin" value={false} labelPlacement="end">No</IonRadio>
                </IonRadioGroup>

                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
}

export default TripItemEdit;