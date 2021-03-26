import { Request, Response } from "express"
import { getCustomRepository } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class AnswerController {
    // http://localhost:3333/answers/4?u=03e8dfad-1458-4a0a-8ed2-abfc451e3584
    async execute (request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUser = await surveyUsersRepository.findOne({
            id: String(u)
        })

        if(!surveyUser){
            return response.status(400).json({
                error: "Survey User does not exists!"
            })
        }
        surveyUser.value =  Number(value);

        await surveyUsersRepository.save(surveyUser);
        return response.json(surveyUser);
    }
}

export { AnswerController }