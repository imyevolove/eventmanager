import SubscriptionDescriptor from "./SubscriptionDescriptor";

/**
 * �������� ������ ��������� �������. 
 * ������������ ��� ���������� ������� ���������,
 * � ����� ������������� ������ � ����� ������ � ������ ������� ���������,
 * ��������, ����������. */
export default class EventManagerContext
{
    subscriptionDescriptors = [];
    subscriptions = {};

    /**
     * ��������� ���������� � �������� �� ����� ���������� � ��������.
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
     * ������� ���������� �� ��������� � ��������� ���� ������ � ���������.
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
     * ������� ���������� �� ��������� �� ������ � ��������� ���� ������ � ���������.
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
     * ���������� ��������� ������������ �� ���������� ����� �������.
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
        // ��� �������
        if (!this.hasEvent(eventName)) return;

        // ������� ��� ���������
        delete this.subscriptions[eventName];
    }

    removeEmptyEvent(eventName)
    {
        // ��� �������
        if (!this.hasEvent(eventName)) return;

        // ���� ����� ��������
        if (this.subscriptions[eventName].length != 0) return;

        // ������� ��� ���������
        delete this.subscriptions[eventName];
    }

    #removeDescriptorFromCollection(collection, descriptor)
    {
        let descriptorIndex = collection.findIndex(d => d == descriptor);
        if (descriptorIndex < 0) return false;

        return collection.splice(descriptorIndex, 1) == 1;
    }
}