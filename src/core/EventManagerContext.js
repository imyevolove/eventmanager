import SubscriptionDescriptor from "./SubscriptionDescriptor";

/**
 * Контекст данных менеджера событий. 
 * Используется для управления данными менеджера,
 * а также предоставляет доступ к своим данным к другим модулям менеджера,
 * например, статистике. */
export default class EventManagerContext
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