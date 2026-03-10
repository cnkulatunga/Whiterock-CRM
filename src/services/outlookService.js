import * as msal from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
import { msalConfig, loginRequest } from "./outlookAuthConfig";

const myMSALObj = new msal.PublicClientApplication(msalConfig);

const initMsal = async () => {
    await myMSALObj.initialize();
    try {
        await myMSALObj.handleRedirectPromise();
    } catch (error) {
        console.error(error);
    }
};

const msalInitPromise = initMsal();

export const signIn = async () => {
    try {
        await msalInitPromise;
        const loginResponse = await myMSALObj.loginPopup(loginRequest);
        return loginResponse.account;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const signOut = async () => {
    await msalInitPromise;
    const logoutRequest = {
        account: myMSALObj.getAccountByHomeId(sessionStorage.getItem("msalAccount")),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
    };
    await myMSALObj.logoutPopup(logoutRequest);
};

export const getAccount = () => {
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length === 0) return null;
    return currentAccounts[0];
};

const getAccessToken = async () => {
    await msalInitPromise;
    const account = getAccount();
    if (!account) return null;

    const request = {
        ...loginRequest,
        account: account
    };

    try {
        const response = await myMSALObj.acquireTokenSilent(request);
        return response.accessToken;
    } catch (error) {
        if (error instanceof msal.InteractionRequiredAuthError) {
            const response = await myMSALObj.acquireTokenPopup(request);
            return response.accessToken;
        }
        console.error(error);
        throw error;
    }
};

export const getCalendarEvents = async () => {
    const token = await getAccessToken();
    if (!token) return [];

    const client = Client.init({
        authProvider: (done) => {
            done(null, token);
        },
    });

    try {
        const events = await client.api("/me/calendar/events")
            .select("subject,start,end,location,status")
            .orderby("start/dateTime DESC")
            .get();
        return events.value;
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
    }
};

export const createCalendarEvent = async (event) => {
    const token = await getAccessToken();
    if (!token) return null;

    const client = Client.init({
        authProvider: (done) => {
            done(null, token);
        },
    });

    try {
        return await client.api("/me/calendar/events").post(event);
    } catch (error) {
        console.error("Error creating calendar event:", error);
        throw error;
    }
};
