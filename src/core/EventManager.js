const EVENT_LISTENER_SYMBOL_NAME = "token";

/**
 * Предоставляет свойства и методы для работы с событиями в контексте менеджера событий.
 * @see EventManager
 * */
export default class EventManager
{
    #_subscriptions = {};
    #_listeners = {};

    get subscriptionsCount() { return Reflect.ownKeys(this.#_subscriptions).length; }
    get eventNamesCount() { return Reflect.ownKeys(this.#_listeners).length; }
    eventsCount(eventName) { return Reflect.has(this.#_listeners, eventName) ? this.#_listeners[eventName].length : 0; }

    constructor()
    {
    }

    subscribe(eventName, callback) 
    {
        let token = Symbol(EVENT_LISTENER_SYMBOL_NAME);
        let subscription = new Subscription(this, token);

        let subscriptionDescriptor = new SubscriptionDescriptor(callback, eventName, subscription);
        this.#_subscriptions[token] = subscriptionDescriptor;

        let listeners = Reflect.has(this.#_listeners, subscriptionDescriptor.eventName)
            ? this.#_listeners[eventName]
            : this.#_listeners[eventName] = [];
        listeners.push(subscriptionDescriptor);

        return subscription;
    }

    /**
     * Удаляет подписку из менеджера по токену.
     * @param {any} token
     */
    unsubscribe(token)
    {
        // Токен не найден
        if (!Reflect.has(this.#_subscriptions, token)) return false;

        // Поиск дескриптора
        let descriptor = this.#_subscriptions[token];
        if (!descriptor) return false;

        if (!this.#deleteDescriptorFromCollection(descriptor)) return false;

        descriptor.destroy();

        // Удаление подписки
        delete this.#_subscriptions[token];

        return true;
    }

    dispatch(eventName, eventData)
    {
        if (!Reflect.has(this.#_listeners, eventName)) return false;

        let lieteners = this.#_listeners[eventName];

        lieteners.forEach(descriptor => descriptor.callback(eventData));

        return true;
    }

    #deleteDescriptorFromCollection(descriptor)
    {
        // Поиск подписчиков по наименованию события
        if (!Reflect.has(this.#_listeners, descriptor.eventName)) return false;

        let listeners = this.#_listeners[descriptor.eventName];

        // Поиск и удаление дескриптора из массива слушателей события
        let descriptorIndex = listeners.indexOf(descriptor);
        listeners.splice(descriptorIndex, 1);

        // Удаление пустого массива
        if (listeners.length == 0) delete this.#_listeners[descriptor.eventName];

        return true;
    }

    /** Возвращает новый экземпляр менеджера событий */
    static create() { return new EventManager(); }
}

export class Subscription
{
    #_disposed = false;
    #_manager;
    #_token;

    get isActive() { return !this.#_disposed; }

    constructor(manager, token)
    {
        this.#_manager = manager;
        this.#_token = token;
    }

    unsubscribe()
    {
        // Нельзя отписать уже отписавшегося слушателя
        if (this.#_disposed) return false;

        // Запись результата отписки
        this.#_disposed = this.#_manager.unsubscribe(this.#_token);

        // Финальная деструктуризация
        if (this.#_disposed) this.#dispose();

        return this.#_disposed;
    }

    #dispose()
    {
        this.#_manager = null;
        this.#_token = null;
    }
}

class SubscriptionDescriptor
{
    constructor(callback, eventName, subscription)
    {
        this.subscription   = subscription;
        this.callback       = callback;
        this.eventName      = eventName;
    }

    destroy()
    {
        this.subscription   = null;
        this.callback       = null;
        this.eventName      = null;
    }
}