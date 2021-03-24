import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepositories";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";
import { UsersRepository } from "../repositories/UsersRepositories";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email})

        if(!userAlreadyExists){
            return response.status(400).json({
                error:"User does not exists .. Usuario não existe"
            });
        }

        const survey = await surveyRepository.findOne({
            id: survey_id,
        })
        if(!survey){
            return response.status(400).json({
                error: "Survey does not exists .. Pesquisa não existe",
            })
        }

        //1 salvar as informações na tabela, surveyUser
        const surveyUser = surveyUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })

        await surveyUsersRepository.save(surveyUser)
        //2 Evniar email para o usuário

        await SendMailService.execute(email, survey.title, survey.description )

        return response.json(surveyUser)
    }
}

export { SendMailController }