export default class Subscription
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