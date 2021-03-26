import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const surveyUsers = await surveyUsersRepository.find({
            survey_id
        })
        const detractor = surveyUsers.filter(
            survey => (survey.value >= 0 && survey.value <= 6)).length;

        const promoters = surveyUsers.filter(
            survey => (survey.value >= 9 && survey.value <= 10)).length;

        const passive = surveyUsers.filter(
            survey => (survey.value >= 7 && survey.value <= 8)).length;

        const totalAnswers = surveyUsers.length;

        const calculate = (promoters - detractor) / totalAnswers
    }
}

export { NpsController }