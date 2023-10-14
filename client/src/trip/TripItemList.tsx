import React from "react";
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import TripItem from "./TripItem";

const TripItemList: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Travel Management App</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <TripItem destination="Paris, France" cost={1000} date="2023-11-01" completed={false} />
                <TripItem destination="New York, USA" cost={1500} date="2023-12-15" completed={false} />
                <TripItem destination="Tokyo, Japan" cost={2000} date="2024-02-28" completed={true} />
                <TripItem destination="Sydney, Australia" cost={1800} date="2024-04-10" completed={false} />
                <TripItem destination="Rome, Italy" cost={1200} date="2024-05-25" completed={true} />
            </IonContent>
        </IonPage>
    );
};

export default TripItemList;