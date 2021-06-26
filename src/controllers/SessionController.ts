import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";

import User from "../models/User";

class SessionController {
  async store(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const { email, password } = request.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user)
      return response
        .status(404)
        .json({ error: "E-mail e/ou senha incorretos" });

    const checkIfPasswordIsCorrect = await compare(password, user.password);
    if (!checkIfPasswordIsCorrect)
      return response
        .status(401)
        .json({ error: "E-mail e/ou senha incorretos" });

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    delete user.password;

    return response.status(200).json({ user, token });
  }
}

export default new SessionController();
