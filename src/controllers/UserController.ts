import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as Yup from "yup";

import User from "../models/User";

class UserController {
  async me(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    return response.json(users);
  }

  async store(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation failed" });
    }

    const userRepository = getRepository(User);
    const { name, email, password } = request.body;

    const checkIfEmailIsUnique = await userRepository.findOne({
      where: { email },
    });

    if (checkIfEmailIsUnique)
      return response
        .status(400)
        .json({ error: "E-mail já está sendo utilizado" });

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    userRepository.save(user);

    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const { id } = request.params;
    const user = await userRepository.findOne(id);

    if (user) {
      userRepository.merge(user, request.body);
      await userRepository.save(user);
    } else {
      response.status(400).send("user not found");
    }

    return response.json({ msg: "updated" });
  }

  async delete(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const { id } = request.params;
    const results = await userRepository.delete(id);
    return response.send(results);
  }
}

export default new UserController();
