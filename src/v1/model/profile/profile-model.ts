import { PoolClient } from "pg";
import { PostgreDatabase } from "../../database";
import { IAuth } from "../auth/auth-interface";
import { Profile } from "./profile-interface";


let db = PostgreDatabase.getInstance()
export const createProfile = async(profile : Profile, user : IAuth, transaction? : PoolClient | undefined) => {
    await db.query("insert into profiles (id, user_id, username) values($1,$2,$3)", [profile.id, user.id, profile.username], undefined,transaction )
}

export const deleteProfile = async(profileId : string,  transaction? : PoolClient | undefined) => {
    await db.query("delete from profiles where id = $1", [profileId], undefined, transaction)
}

export const getProfile = async (id : string | undefined,transaction? : PoolClient | undefined) => {
    if(!id)
        throw new Error("Id is not defined")

    await db.query("select id, username, email, photo from profile where id = $1", [id], undefined, transaction)
}

export const updateProfile = async (profile : Profile, transaction? : PoolClient | undefined) => {
    await db.query("update set username = $1, photo = $2 where id = $3", [profile.username, profile.photo, profile.id], undefined, transaction)
}