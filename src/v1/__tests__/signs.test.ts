import request from "supertest"
import app from ".."

describe("test signup request", () => {
    
    it("POST / signup", async () => {
        const req = await request(app)
            .post("/auth/sign-up")
            .send({ username: "John doe", email: "johndoe@example.com", password: "123456789", passwordAgain: "123456789" })
            .set("Content-type", "application/json")

        expect(req.text).not.toBe(null)
        expect(req.body).toHaveProperty("success")
    })

    it("POST / sign-in", async() => {
        const req = await request(app)
        .post("/auth/sign-in")
        .send({email : "test@gmail.com", password : "123456789"})
        .set("Content-type", "application/json")

        expect(req.statusCode).toBe(200)
        expect(req.body).not.toBe(null)
    })

        
    it("POST refresh token", async() => {
        const req = await request(app)
        .post("/auth/refresh")
        .send({refresh_token : "136e66a3-077f-4794-b042-b81a7c3a8796", client: "mobile-android"})
        .set("Content-type", "application/json")

        expect(req.status).toBe(200)
    })

})