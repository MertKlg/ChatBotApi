export interface IAuth {
    id : string
    email : string
    role? : string,
    created_at? : Date
    updated_at? : Date
}

export interface IAuthWithPassword extends IAuth {
    password : string
}

export interface RefreshToken{
    id : string,
    user_id : string,
    token : string,
    client : string,
    expiresAt : Date
}

export type CreateRefreshToken = Omit<RefreshToken, 'id'>
