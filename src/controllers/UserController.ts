import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepositories';

class UserController {
    async create(request: Request, response: Response){
        const { name, email } = request.body;
        
        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if(userAlreadyExists){
            return response.status(400).json({
                error: "Email já cadastrado!",
            })
        }
        
        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save(user)

        return response.status(201).json(user)
    }
}

export { UserController };
