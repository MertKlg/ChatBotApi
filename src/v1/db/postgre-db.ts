import { Client, Connection, Pool, PoolClient, QueryResult } from "pg"
import { IResult } from "./model/response/response-interface"
import AppConfig from "../config/app-config"

abstract class Database {
    abstract query<T>(query: string, params: any[], rowMapper?: RowMapper<T>, transaction?: PoolClient): Promise<T[]>
    abstract close(): void
    abstract connect(url: string): Promise<void>
}

type RowMapper<T> = (row: any) => T

enum TransactionTypes {
    BEGIN = "BEGIN",
    COMMIT = "COMMIT",
    ROLLBACK = "ROLLBACK"
}

class PostgreDatabase implements Database {
    private static instance: PostgreDatabase
    private pool?: Pool

    async close(): Promise<void> {
        if (this.pool)
            await this.pool.end()
    }

    async connect(url: string | undefined): Promise<void> {
        if (!url)
            throw new Error("No database url founded")

        if (!this.pool) {
            this.pool = new Pool({ connectionString: url })
            await this.pool.connect()
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PostgreDatabase()
        }
        return this.instance
    }

    async query<T>(query: string, params: any[], rowMapper?: (row: any) => T, transaction?: PoolClient | undefined): Promise<T[]> {
        if (!this.pool) {
            throw new Error("Database not initilazed")
        }

        const

        const result = transaction ? await transaction.query(query, params) : await this.pool.query(query, params)
        if (Array.isArray(result.rows) && rowMapper) {
            const mapper = result.rows.map(rowMapper)
            return mapper
        } else if (Array.isArray(result.rows)) {
            return result.rows as T[]
        } else {
            return [] as T[]
        }

    }

    async transaction<T>(func: (poolClient: PoolClient) => Promise<IResult<T>>): Promise<IResult<T>> {
        if (!this.pool) {
            throw new Error("Database not initilazed")
        }

        const poolClient = await this.pool.connect()
        try {
            await poolClient.query(TransactionTypes.BEGIN)
            const result = await func(poolClient)
            await poolClient.query(TransactionTypes.COMMIT)

            return result
        } catch (e) {
            console.error(e)
            await poolClient.query(TransactionTypes.ROLLBACK)
            return {
                error: e instanceof Error ? e : new Error("Interval server error")
            }
        } finally {
            poolClient.release()
        }
    }
}

export default PostgreDatabase.getInstance()