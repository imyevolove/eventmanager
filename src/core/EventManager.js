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

/** 
 * Контекст данных менеджера событий. 
 * Используется для управления данными менеджера,
 * а также предоставляет доступ к своим данным к другим модулям менеджера,
 * например, статистике. */
class EventManagerContext
{
    subscriptionDescriptors = [];
    subscriptions = {};

    /**
     * Добавляет дескриптор в контекст со всеми привязками к событиям.
     * @param {SubscriptionDescriptor} descriptor
     * @returns {SubscriptionDescriptor}
     */
    registerDescriptor(descriptor)
    {
        this.subscriptionDescriptors.push(descriptor);
        this.getOrCreateEventCollection(descriptor.eventName).push(descriptor);

        return descriptor;
    }

    /**
     * Удаляет дескриптор из контекста с удалением всех связей с событиями.
     * @param {SubscriptionDescriptor} descriptor
     * @returns {Boolean}
     */
    unregisterDescriptor(descriptor)
    {
        this.#removeDescriptorFromCollection(this.subscriptionDescriptors, descriptor);
        this.#removeDescriptorFromCollection(this.getOrCreateEventCollection(descriptor.eventName), descriptor);

        this.removeEmptyEvent(descriptor.eventName);

        return true;
    }

    /**
     * Удаляет дескриптор из контекста по токену с удалением всех связей с событиями.
     * @param {Symbol} token
     * @returns {Boolean}
     */
    unregisterDescriptorByToken(token, destroyDescriptor = true)
    {
        let descriptor = this.getDescriptor(token);
        let deleted = !descriptor ? false : this.unregisterDescriptor(descriptor);

        if (deleted && destroyDescriptor)
        {
            descriptor.destroy();
        }

        return deleted;
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

    /**
     * Возвращает коллекцию дескрипторов по указанному имени события.
     * @param {String} eventName
     * @returns {Array<SubscriptionDescriptor>}
     */
    getEventCollection(eventName)
    {
        return this.subscriptions.hasOwnProperty(eventName) ? this.subscriptions[eventName] : null;
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