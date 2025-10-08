import request from "supertest"
import app from ".."

describe("CHAT TESTS", () => {
    it("POST /chat/create", async () => {
        const req = await request(app)
        .post("/chat/create")
        .set("Content-type", "application/json")

        expect(req.status).toBe(200)
    })
})