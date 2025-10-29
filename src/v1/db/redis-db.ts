import { createClient, RedisArgument, RedisClientType } from "redis";

class RedisDatabase {
    public static instance: RedisDatabase
    private client?: RedisClientType

    async connect() {
        if (!this.client) {
            this.client = createClient()
            this.client.on('error', (err) => console.log('Redis Client Error', err));
            await this.client.connect()
        }
    }

    async getClient(): Promise<RedisClientType | null> {
        return this.client ? this.client : null
    }

    async setValue(key: string, value: any): Promise<void> {
        if (!this.client)
            throw new Error("Redis client is not connected")
        await this.client.set(key, value)
    }

    async getValue(key: string): Promise<string | null> {
        if (!this.client)
            throw new Error("Redis client is not connected")
        return await this.client.get(key)
    }

    async remove(key: string): Promise<void> {
        if (!this.client)
            throw new Error("Redis client is not connected")
        await this.client.del(key)
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisDatabase()
        }
        return this.instance
    }

    close() {
        this.client?.close()
    }
}

export default RedisDatabase.getInstance()