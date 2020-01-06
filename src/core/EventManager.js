import Subscription from "./Subscription";
import SubscriptionDescriptor from "./SubscriptionDescriptor";
import EventManagerContext from "./EventManagerContext";

const EVENT_LISTENER_SYMBOL_NAME = "token";

let globalManager = undefined;

/**
 * Предоставляет свойства и методы для работы с событиями в контексте менеджера событий.
 * @see EventManager
 * */
export default class EventManager
{
    /** @type {EventManagerContext} */
    #_context = new EventManagerContext();

    constructor()
    {
    }

    /**
     * Подписывается на событие
     * @param {String} eventName
     * @param {Function} callback
     * @returns {Subscription}
     */
    subscribe(eventName, callback) 
    {
        /** @type {EventManagerContext} */
        let context = this.#_context;

        let token = Symbol(EVENT_LISTENER_SYMBOL_NAME);
        let subscription = new Subscription(this, token);
        let subscriptionDescriptor = new SubscriptionDescriptor(token, callback, eventName, subscription);

        return context.registerDescriptor(subscriptionDescriptor).subscription;
    }

    /**
     * Удаляет подписку из менеджера по токену.
     * @param {Symbol} token
     * @returns {Boolean}
     */
    unsubscribe(token)
    {
        /** @type {EventManagerContext} */
        let context = this.#_context;

        return context.unregisterDescriptorByToken(token);
    }

    /**
     * Вызывает событие по указанному имени с переданными данными.
     * @param {any} eventName
     * @param {any} eventData
     */
    dispatch(eventName, eventData)
    {
        /** @type {EventManagerContext} */
        let context = this.#_context;

        let collection = context.getEventCollection(eventName);
        if (!collection) return false;

        collection.forEach(descriptor => descriptor.callback(eventData));

        return true;
    }

    /** 
     * Возвращает новый экземпляр менеджера событий
     * @returns {EventManager}
     */
    static create() { return new EventManager(); }

    /**
     * Возвращает глобальный экземпляр менеджера событий
     * @returns {EventManager}
     */
    static get global()
    {
        return !globalManager
            ? globalManager = new EventManager()
            : globalManager;
    }
}