/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import request from "supertest";
import testJson from "../../src/config/test.json";
import start, { app } from "../../src/express/index";
import { Server } from "http";
//import { sleep } from "../../src/utils/indexTest";

let server: Server;
beforeAll(async () => {
  try {
    server = await start("3002");
  } catch (err) {}
});
afterAll(async () => {
  await server.close();
});
const serviceTypes: string[] = testJson.valueObjects.serviceType.values;
const entityTypes: { Soldier: string; Civilian: string; GoalUser: string } =
  testJson.valueObjects.EntityType;
const digitalIdentitiesDomains: string[] =
  testJson.valueObjects.digitalIdentityId.domain.values;
const allSources: string[] = testJson.valueObjects.source.values;
const allDITypes = testJson.valueObjects.digitalIdentityType;

describe("VALID CREATIONS FOR ENTITIES", () => {
  const entitySoldierToCreate: any = {
    firstName: "noam",
    lastName: "shilony",
    entityType: entityTypes.Soldier,
    identityCard: "206917817",
    personalNumber: "8517714",
    serviceType: serviceTypes[0],
  };
  const entityCivilianToCreate: any = {
    firstName: "david",
    lastName: "heymann",
    entityType: entityTypes.Civilian,
    identityCard: "207026568",
  };
  const entityGoalUserToCreate: any = {
    firstName: "roei",
    lastName: "oren",
    entityType: entityTypes.GoalUser,
    goalUserId: `t43242@${digitalIdentitiesDomains[0]}`,
  };
  it("should create an entity with SOLDIER PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entitySoldierToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
  it("should create an entity with CIVILIAN PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entityCivilianToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
  it("should create an entity with GoalUser PROPERTIES!", async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entityGoalUserToCreate)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          console.log(err);
          throw done(err);
        }
        expect(res.body).toHaveProperty("id");
        return done();
      });
  });
});

describe("Connect/Disconnect DI to entity", () => {
  const entitySoldierToCreate: any = {
    firstName: "hagai",
    lastName: "milo",
    entityType: entityTypes.Soldier,
    identityCard: "346131147",
    personalNumber: "8517713",
    serviceType: serviceTypes[1],
  };
  const digitalIdToCreate: any = {
    uniqueId: `t1234@${digitalIdentitiesDomains[0]}`,
    type: allDITypes.DomainUser,
    source: allSources[1],
  };
  let entityId;
  let diId = `t1234@${digitalIdentitiesDomains[0]}`;

  beforeAll(async (done) => {
    request(app)
      .post(`/api/entities`)
      .send(entitySoldierToCreate)
      .end((err: any, res: any) => {
        if (err) {
          throw err;
        }
        entityId = res.body.id;
        request(app)
          .post("/api/digitalIdentities")
          .send(digitalIdToCreate)
          .end((err: any, res2: any) => {
            if (err) {
              throw err;
            }
            return done();
          })
          .expect(200);
      })
      .expect(200);
  });
  afterEach(() => {
    jest.setTimeout(2000);
  });

  it("should connect the both of themselves", async (done) => {
    request(app)
      .put(`/api/entities/${entityId}/digitalIdentity/${diId}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          throw done(err);
        }
        return done();
      });
  });
  it("should return entity with the DI id", async (done) => {
    request(app)
      .get(`/api/entities/${entityId}`)
      .expect(200)
      .end(async (err: any, res: any) => {
        if (err) {
          throw done(err);
        }
        console.log(res.body);
        return done();
      });
  });
});