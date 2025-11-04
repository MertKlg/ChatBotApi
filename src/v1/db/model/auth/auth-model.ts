import { PoolClient } from "pg"
import { IAuth, IAuthWithPassword } from "./auth-interface"
import { CreateRefreshToken } from "./auth-interface"
import postgreDb from "../../postgre-db"



export const findUserById = async (id?: string | number, transaction?: PoolClient | undefined): Promise<IAuth | undefined> => {
    if (!id) {
        throw new Error("Id can not be empty")
    }
    return (await postgreDb.query<IAuth>("select id,email,role,created_at from users where id = $1", [id], undefined, transaction))[0]
}

export const findUserByEmail = async (email?: string, transaction?: PoolClient | undefined): Promise<IAuth | undefined> => {
    if (!email) {
        throw new Error("Email can not be empty")
    }

    return (await postgreDb.query<IAuth>("select id,email,role,created_at from users where email = $1", [email], undefined, transaction))[0]
}

export const findUserPassword = async (id: string | undefined, transaction?: PoolClient | undefined): Promise<IAuthWithPassword | undefined> => {
    if (!id) {
        throw new Error("Id can not be empty")
    }

    return (await postgreDb.query<IAuthWithPassword | undefined>("select password from users where id = $1", [id], undefined, transaction))[0]
}

export const createUser = async (user: IAuthWithPassword, transaction?: PoolClient | undefined): Promise<void> => {
    await postgreDb.query("insert into users (id,email,password) values ($1,$2,$3)", [user.id, user.email, user.password], undefined, transaction)
}

export const updateUser = async (user: IAuthWithPassword, transaction?: PoolClient | undefined) => {
    await postgreDb.query("update users set password = $1, email = $2 where id = $3", [user.password, user.email, user.id], undefined, transaction)
}

export const deleteUser = async (id: string | undefined, transaction?: PoolClient | undefined) => {
    await postgreDb.query("delete from users where id = $1", [id], undefined, transaction)
}

/* REFRESH TOKEN QUERIES */
export const createRefreshToken = async (token: CreateRefreshToken, transaction: PoolClient | undefined) => {
    await postgreDb.query("insert into refresh_tokens (user_id,token, client, expires_at) values ($1, $2, $3, $4)", [token.user_id, token.token, token.client, token.expiresAt], undefined, transaction)
}

export const findRefreshTokenByUserId = async (user_id: string, transaction: PoolClient | undefined) => {
    return await postgreDb.query("select user_id from refresh_tokens where token = [$1]", [user_id], undefined, transaction)
}

export const findRefreshTokenByToken = async (hashedToken: string, transaction: PoolClient | undefined): Promise<{ user_id: string, id: string, token: string, client: string, expires_at: Date } | undefined> => {
    return (await postgreDb.query<{ user_id: string, id: string, token: string, client: string, expires_at: Date }>("select user_id, id, token, client,expires_at from refresh_tokens where token = $1", [hashedToken], undefined, transaction))[0]
}

export const deleteRefreshToken = async (id: string | undefined, transaction: PoolClient | undefined) => {
    await postgreDb.query("delete from refresh_tokens where id = $1", [id], undefined, transaction)
}