import Subscription from "./Subscription";

export default class SubscriptionDescriptor
{
    constructor(token, callback, eventName, subscription)
    {
        /** @type {Symbol} */
        this.token = token;

        /** @type {Subscription} */
        this.subscription = subscription;

        /** @type {Function} */
        this.callback = callback;

        /** @type {String} */
        this.eventName = eventName;
    }

    destroy()
    {
        this.token = null;
        this.subscription = null;
        this.callback = null;
        this.eventName = null;
    }
}