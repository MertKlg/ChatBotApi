export class UserSocketPool {
    public static instance : UserSocketPool
    private pool : Map<string,string> = new Map()

    addUser(userId : string, clientId : string){
        if(!this.pool.get(userId))
            this.pool.set(userId,clientId)
    }

    removeUser(userId : string){
        if(this.pool.get(userId))
            this.pool.delete(userId)
    }

    getUser(userId : string) : string | undefined{
        return this.pool.get(userId)
    }
}