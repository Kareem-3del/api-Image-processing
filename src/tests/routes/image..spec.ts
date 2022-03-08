import supertest from "supertest";
import server from "../../server"

const request = supertest(server.app);
describe("CHECK IMAGE PROCTORING", () => {
    let size = 0;
    it("CHECK IF IMAGE RESPONSE",  (done) => {
        request.get("/image/fjord").then(response=>{
            expect(response.headers['content-type']).toBe('image/webp');
            size = response.headers['content-type']
            done();
        });
    });


    it("CHECK IF IMAGE SIZE MUST BE SMALLER BECAUSE THE SIZE IS SMALLER",  (done) => {
        request.get("/image/fjord?w=100&h=100").then(response=>{
            expect(response.headers['content-length']).toBeLessThan(size);
            done();
        });
    });

    it("CHECK NOT EXITS IMAGE RESPONSE",  (done) => {
        request.get("/image/<IMAGE-NOT-EXITS>").then(response=>{
            expect(response.body.message).toBe('IMAGE NOT FOUND');
            expect(response.statusCode).toBe(404);
            done();
        });
    });

});