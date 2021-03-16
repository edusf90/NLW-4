import 'reflect-metadata';
import express, { request, response } from 'express'
import './database';
const app = express();

/*
Get > buscar
post > Salvar
put > alterar
delete > deletar
patch > alteração específica 

*/

app.get("/", (request, response) =>{
    return response.json({message: "Hello World - NLW 04"})
})

app.post("/", (request, response) =>{
    return response.json({message: "Dados salvos com sucesso!"})
})

app.listen(3333, () => console.log("Server is runnig!"));

