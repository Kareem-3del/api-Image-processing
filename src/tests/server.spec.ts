import supertest from "supertest";
import server from "../server"

const request = supertest(server.app);
describe("CHECK API-SERVER", () => {
    it("SERVER WORK", (done) => {
        request.get('/').then(res => {
            expect(res.status).toBe(200)
            done()
        })
    })


    it("CHECK IF API READY",  (done) => {
        request.get("/").then(response=>{
            expect(response.body.message).toBe("API READY");
            done();
        });
    });

});