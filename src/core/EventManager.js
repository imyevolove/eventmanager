const EVENT_LISTENER_SYMBOL_NAME = "token";

/**
 * ������������� �������� � ������ ��� ������ � ��������� � ��������� ��������� �������.
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
     * ������� �������� �� ��������� �� ������.
     * @param {any} token
     */
    unsubscribe(token)
    {
        // ����� �� ������
        if (!Reflect.has(this.#_subscriptions, token)) return false;

        // ����� �����������
        let descriptor = this.#_subscriptions[token];
        if (!descriptor) return false;

        if (!this.#deleteDescriptorFromCollection(descriptor)) return false;

        descriptor.destroy();

        // �������� ��������
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
        // ����� ����������� �� ������������ �������
        if (!Reflect.has(this.#_listeners, descriptor.eventName)) return false;

        let listeners = this.#_listeners[descriptor.eventName];

        // ����� � �������� ����������� �� ������� ���������� �������
        let descriptorIndex = listeners.indexOf(descriptor);
        listeners.splice(descriptorIndex, 1);

        // �������� ������� �������
        if (listeners.length == 0) delete this.#_listeners[descriptor.eventName];

        return true;
    }

    /** ���������� ����� ��������� ��������� ������� */
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
        // ������ �������� ��� ������������� ���������
        if (this.#_disposed) return false;

        // ������ ���������� �������
        this.#_disposed = this.#_manager.unsubscribe(this.#_token);

        // ��������� ����������������
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