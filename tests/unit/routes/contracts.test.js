const request = require("supertest");
const app = require("../../../src/app");

describe("Contract routes", () => {
    describe("GET /contracts/:id", () => {
      it("should return a contract if it belongs to the profile", async () => {
        const res = await request(app)
          .get(`/contracts/2`)
          .set("profile_id", "1");
        expect(res.statusCode).toBe(200);
        expect(res.body.ClientId).toBe(1);
      });

      it("should return 404 if contract does not belong to the profile", async () => {
        const res = await request(app)
          .get(`/contracts/3`)
          .set("profile_id", "1");
        expect(res.statusCode).toBe(404);
      });
    });

  describe("GET /contracts", () => {
    it("should return all contracts belonging to the profile", async () => {
      const res = await request(app).get("/contracts").set("profile_id", "1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(
        res.body[0].ClientId === 1 || res.body[0].ContractorId === 1
      ).toBeTruthy();
    });
  });
});
