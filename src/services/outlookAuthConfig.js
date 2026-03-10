export const msalConfig = {
    auth: {
        clientId: "ENTER_YOUR_CLIENT_ID_HERE", // Application (client) ID from Azure Portal
        authority: "https://login.microsoftonline.com/common", // "common" for multi-tenant or your Tenant ID
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    }
};

// Scopes for API calls
export const loginRequest = {
    scopes: ["User.Read", "Calendars.ReadWrite"]
};

// Graph API endpoint
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/calendar/events"
};
