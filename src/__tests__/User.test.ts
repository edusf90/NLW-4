import { response } from 'express';
import request from 'supertest';
import {app} from '../app'

import createConnection from '../database'

describe("Users", async ()=>{
    beforeAll(async()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Deve criar um novo usuario", async ()=> {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })
        expect(response.status).toBe(201);
    })
    it("Não deve ser criado um novo usuario", async()=>{
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })
        expect(response.status).toBe(400);
    })
})