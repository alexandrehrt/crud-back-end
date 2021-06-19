import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as Yup from "yup";

import Employee from "../models/Employee";

class EmployeeController {
  async index(_: Request, response: Response) {
    const employeeRepository = getRepository(Employee);
    const employees = await employeeRepository.find();

    return response.json(employees);
  }

  async findOne(request: Request, response: Response) {
    const employeeRepository = getRepository(Employee);
    const { id } = request.params;
    const employee = await employeeRepository.findOne(id);
    console.log({ employee });

    return response.json(employee);
  }

  async store(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      job: Yup.string().required(),
      profilePicture: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation failed" });
    }

    const employeeRepository = getRepository(Employee);
    const { name, email, job, profilePicture } = request.body;

    const checkIfEmailIsUnique = await employeeRepository.findOne({
      where: { email },
    });

    if (checkIfEmailIsUnique)
      return response
        .status(400)
        .json({ error: "E-mail já está sendo utilizado" });

    const employee = employeeRepository.create({
      name,
      email,
      job,
      profile_picture: profilePicture,
    });

    employeeRepository.save(employee);

    return response.status(201).json(employee);
  }

  async update(request: Request, response: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      job: Yup.string(),
      profilePicture: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Validation failed" });
    }

    const employeeRepository = getRepository(Employee);
    const { id } = request.params;
    const employee = await employeeRepository.findOne(id);

    if (employee) {
      employeeRepository.merge(employee, request.body);
      await employeeRepository.save(employee);
    } else {
      response.status(400).send("user not found");
    }

    return response.status(200).send();
  }

  async delete(request: Request, response: Response) {
    const employeeRepository = getRepository(Employee);
    const { id } = request.params;
    const results = await employeeRepository.delete(id);
    return response.send(results);
  }
}

export default new EmployeeController();
