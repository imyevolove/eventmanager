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