const EVENT_LISTENER_SYMBOL_NAME = "token";

/**
 * Предоставляет свойства и методы для работы с событиями в контексте менеджера событий.
 * @see EventManager
 * */
export default class EventManager
{
    #_context = new EventManagerContext();

    constructor()
    {
    }

    subscribe(eventName, callback) 
    {
        let token = Symbol(EVENT_LISTENER_SYMBOL_NAME);
        let subscription = new Subscription(this, token);
        let subscriptionDescriptor = new SubscriptionDescriptor(token, callback, eventName, subscription);

        this.#_context.addDescriptor(subscriptionDescriptor);

        return subscription;
    }

    /**
     * Удаляет подписку из менеджера по токену.
     * @param {any} token
     */
    unsubscribe(token)
    {
        let descriptor = this.#_context.getDescriptor(token);
        if (descriptor == null) return;

        this.#_context.removeDescriptor(descriptor);

        // Удаление подписки
        descriptor.destroy();

        return true;
    }

    dispatch(eventName, eventData)
    {
        if (!this.#_context.subscriptions.hasOwnProperty(eventName)) return false;

        let lieteners = this.#_context.subscriptions[eventName];

        lieteners.forEach(descriptor => descriptor.callback(eventData));

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
    constructor(token, callback, eventName, subscription)
    {
        this.token = token;
        this.subscription = subscription;
        this.callback = callback;
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

/** 
 * Контекст данных менеджера событий. 
 * Используется для управления данными менеджера,
 * а также предоставляет доступ к своим данным к другим модулям менеджера,
 * например, статистике. */
class EventManagerContext
{
    subscriptionDescriptors = [];
    subscriptions = {};

    addDescriptor(descriptor)
    {
        this.subscriptionDescriptors.push(descriptor);
        this.getOrCreateEventCollection(descriptor.eventName).push(descriptor);
    }

    getDescriptor(token)
    {
        return this.subscriptionDescriptors.find(d => d.token == token);
    }

    getOrCreateEventCollection(eventName)
    {
        return this.subscriptions.hasOwnProperty(eventName)
            ? this.subscriptions[eventName]
            : this.subscriptions[eventName] = [];
    }

    removeDescriptor(descriptor)
    {
        this.#removeDescriptorFromCollection(this.subscriptionDescriptors, descriptor);
        this.#removeDescriptorFromCollection(this.getOrCreateEventCollection(descriptor.eventName), descriptor);

        this.removeEmptyEvent(descriptor.eventName);
    }

    hasEvent(eventName)
    {
        return this.subscriptions.hasOwnProperty(eventName);
    }

    removeEvent(eventName)
    {
        // Нет события
        if (!this.hasEvent(eventName)) return;

        // Удаляем без сожаления
        delete this.subscriptions[eventName];
    }

    removeEmptyEvent(eventName)
    {
        // Нет события
        if (!this.hasEvent(eventName)) return;

        // Есть живые подписки
        if (this.subscriptions[eventName].length != 0) return;

        // Удаляем без сожаления
        delete this.subscriptions[eventName];
    }

    #removeDescriptorFromCollection(collection, descriptor)
    {
        let descriptorIndex = collection.findIndex(d => d == descriptor);
        if (descriptorIndex < 0) return false;

        return collection.splice(descriptorIndex, 1) == 1;
    }
}