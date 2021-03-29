import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepositories";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";
import { UsersRepository } from "../repositories/UsersRepositories";
import SendMailService from "../services/SendMailService";
import {resolve} from 'path';
import { SurveyUser } from "../models/SurveyUser";
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email})

        if(!user){
            throw new AppError("Survey does not exists .. Pesquisa não existe")
        }

        const survey = await surveyRepository.findOne({
            id: survey_id,
        })
        if(!survey){
            throw new AppError("Survey does not exists .. Pesquisa não existe")
        }

       

        const npsPath = resolve(__dirname, "..", "views","emails","npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"],
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "", 
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        //1 salvar as informações na tabela, surveyUser
        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveyUsersRepository.save(surveyUser)
        //2 Evniar email para o usuário
        
        variables.id = surveyUser.id;
        
        await SendMailService.execute(email, survey.title, variables, npsPath )

        return response.json(surveyUser)
    }
}

export { SendMailController }