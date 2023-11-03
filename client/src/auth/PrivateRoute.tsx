import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Redirect, Route} from "react-router-dom";
import {AuthContext, AuthState} from "./authProvider";
import {getLogger} from "../utils";
import {usePreferences} from "../utils/usePreferences";
import {TripItemProps} from "../trip/TripItemProps";

const log = getLogger("Login");

export interface PrivateRouteProps {
    component: any;
    path: string;
    exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, ...rest}) => {
    const {isAuthenticated} = useContext<AuthState>(AuthContext);

    const {get} = usePreferences();

    const [token, setToken] = useState("");
    useEffect(() => {
        const getToken = async () => {
            const result = await get("loginToken");
            setToken(result!);
        };

        getToken();
    }, []);

    log("render, isAuthenticated" + isAuthenticated);

    // return (
    //     <Route {...rest} render={props => {
    //         if(isAuthenticated) {
    //             return <Component {...props} />
    //         }
    //         return <Redirect to={{pathname: "/login"}} />
    //     }}/>
    // );

    return (
        <Route {...rest} render={props => {
            if(token !== "" || isAuthenticated) {
                return <Component {...props} />
            }
            return <Redirect to={{pathname: "/login"}} />
        }}/>
    );
}