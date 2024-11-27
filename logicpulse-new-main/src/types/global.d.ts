import { AxiosInstance } from "axios";
import Pusher from "pusher-js";
import { route as ziggyRoute } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
}
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}
export interface NotificationEvent {
    message: string;
}
