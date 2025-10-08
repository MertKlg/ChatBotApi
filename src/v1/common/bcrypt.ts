import bcrypt from "bcrypt"
import crypto from "crypto"
let saltRound = 10
let algorithm = "SHA-256"

export const hashData = async(value : string | undefined) : Promise<string>=> {
    if(!value)
        throw new Error("Value is not defined")
    return await bcrypt.hash(value, saltRound)
}

export const compare = async(value : string | undefined, hashedValue : string | undefined) : Promise<boolean> => {
    if(!value || !hashedValue)
        throw new Error("Value is not defined")
    return await bcrypt.compare(value, hashedValue)
}

export const hashValue = (value : string) =>{
    if(!value)
        throw new Error("Value not defined")
    return crypto.createHash(algorithm).update(value).digest("hex")
}