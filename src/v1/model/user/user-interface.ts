export interface LoginUserDto{
    email : string,
    password : string,
    client : string
}

export interface RegisterUserDto{
    username : string,
    email : string,
    password : string,
    passwordAgain : string
}