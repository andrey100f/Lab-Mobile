import React, {useCallback, useContext, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem, IonLabel,
    IonLoading,
    IonPage,
    IonTitle, IonToast,
    IonToolbar
} from '@ionic/react';
import {AuthContext} from "./authProvider";
import {getLogger} from "../utils";
import {usePreferences} from "../utils/usePreferences";

const log = getLogger("Login");

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const {get} = usePreferences();
    const {isAuthenticated, isAuthenticating, login, authenticationError} = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const {username, password} = state;

    const [token, setToken] = useState("");

    useEffect(() => {
        const getToken = async () => {
            const result = await get("loginToken");
            setToken(result!);
        };

        getToken();
    }, []);


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
        window.location.href = "/trips";
    }, [username, password, token]);

    log("render");

    useEffect(() => {
        if(isAuthenticated || token !== "") {
            log("redirecting to home");
            history.push("/");
        }
    }, [isAuthenticated, token]);

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
                        <IonInput type="password" value={password} onIonChange={handlePasswordChange}/>
                    </IonItem>
                    <IonButton className="ion-margin-top" expand="block" shape="round" fill="outline" onClick={handleLogin}>Login</IonButton>
                </div>
                <IonLoading isOpen={isAuthenticating} />

                {authenticationError && (
                    <IonToast isOpen={true} className="ion-color-danger" duration={2000}
                              message={authenticationError.message || "Failed to authenticate"} ></IonToast>
                )}
            </IonContent>
        </IonPage>
    );
};