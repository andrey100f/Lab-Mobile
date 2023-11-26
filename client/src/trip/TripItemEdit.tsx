import {getLogger} from "../utils";
import {TripItemContext} from "./TripItemProvider";
import {TripItemProps} from "./TripItemProps";
import {RouteComponentProps} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {
    IonActionSheet,
    IonButton,
    IonButtons, IonCol,
    IonContent, IonDatetime,
    IonDatetimeButton, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput, IonLoading, IonModal,
    IonPage, IonRadio, IonRadioGroup, IonRow,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {useNetwork} from "../utils/useNetwork";
import {usePreferences} from "../utils/usePreferences";
import {camera, trash, close} from "ionicons/icons";
import {MyPhoto, usePhotos} from "../utils/usePhotos";
import MyMap from "../utils/location/myMap";

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
    const [latitude, setLatitude] = useState(10);
    const [longitude, setLongitude] = useState(10);

    const { photos, takePhoto, deletePhoto } = usePhotos();
    const [photoToDelete, setPhotoToDelete] = useState<MyPhoto>();

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
            setLatitude(parseFloat(tripItem.latitude.toString()));
            setLongitude(parseFloat(tripItem.longitude.toString()));
        }
    }, [match.params.id, tripItems]);

    const handleSave = () => {
        const editedTripItem = tripItem ? {...tripItem, destination, cost, completed,
            tripDate, latitude, longitude} : {destination, cost, completed, tripDate, latitude, longitude};
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

                <IonGrid>
                    <IonRow>
                        {photos.filter(photo => photo.filepath.includes(tripItem?.tripId!))
                            .map((photo, index) => (
                                <IonCol size="6" key={index}>
                                    <IonImg onClick={() => setPhotoToDelete(photo)}
                                            src={photo.webviewPath}/>
                                </IonCol>
                            ))}
                    </IonRow>
                </IonGrid>
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => takePhoto(tripItem?.tripId)}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[{
                        text: 'Delete',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            if (photoToDelete) {
                                deletePhoto(photoToDelete);
                                setPhotoToDelete(undefined);
                            }
                        }
                    }, {
                        icon: close,
                        role: 'cancel',
                        text: 'Cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />

                <div>My Location is</div>
                <div>latitude: {latitude}</div>
                <div>longitude: {longitude}</div>
                {latitude && longitude &&
                    <MyMap
                        lat={latitude}
                        lng={longitude}
                        onMapClick={(e) => {
                            setLatitude(e.latitude);
                            setLongitude(e.longitude);
                        }}
                        onMarkerClick={() => console.log('onMarker')}
                    />}

            </IonContent>
        </IonPage>
    );
}

export default TripItemEdit;