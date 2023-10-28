import React, {useCallback, useContext, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {
    IonButton,
    IonCard,
    IonContent,
    IonHeader,
    IonInput,
    IonItem, IonLabel,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {AuthContext} from "./authProvider";
import {getLogger} from "../utils";

const log = getLogger("Login");

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const {isAuthenticated, isAuthenticating, login, authenticationError} = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const {username, password} = state;

    const handlePasswordChange = useCallback((e: any) => setState({
        ...state,
        password: e.detail.value || ""
    }), [state]);

    const handleUsernameChange = useCallback((e: any) => setState({
        ...state,
        username: e.detail.value || ""
    }), [state]);

    const handleLogin = useCallback(() => {
        log("handleLogIn...");
        login?.(username, password);
    }, [username, password]);

    log("render");

    useEffect(() => {
        if(isAuthenticated) {
            log("redirecting to home");
            history.push("/");
        }
    }, [isAuthenticated]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="ion-padding">
                    <IonItem>
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput value={username} onIonChange={handleUsernameChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput value={password} onIonChange={handlePasswordChange}/>
                    </IonItem>
                    <IonButton className="ion-margin-top" expand="block" onClick={handleLogin}>Login</IonButton>
                </div>
                <IonLoading isOpen={isAuthenticating} />

                {authenticationError && (
                    <div>{authenticationError.message || "Failed to authenticate"}</div>
                )}
            </IonContent>
        </IonPage>
    );
};