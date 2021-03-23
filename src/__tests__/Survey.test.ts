import { response } from 'express';
import request from 'supertest';
import {app} from '../app'

import createConnection from '../database'

describe("Surveys", async ()=>{
    beforeAll(async()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Deve ser feito uma pesquisa", async ()=> {
        const response = await request(app).post("/surveys").send({
            title: "Title Example",
            description: "description Example"
        })
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id")
    })

    it("Deve ser pesquisado tudo", async()=>{
       await request(app).post("/surveys").send({
            title: "Title Example2",
            description: "description Example2"
        })
        const response = await request(app).get("/surveys")
        expect(response.body.length).toBe(2);

    })
})