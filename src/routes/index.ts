import { Router } from "express";

import EmployeeController from "../controllers/EmployeeController";
import SessionController from "../controllers/SessionController";
import UserController from "../controllers/UserController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const routes = Router();

routes.get("/users/me", UserController.me);
routes.post("/users/create", UserController.store);
routes.post("/signin", SessionController.store);

routes.use(ensureAuthenticated);

routes.get("/employees", EmployeeController.index);
routes.get("/employee/:id", EmployeeController.findOne);
routes.post("/employee/create", EmployeeController.store);
routes.patch("/employee/:id", EmployeeController.update);
routes.delete("/employee/:id", EmployeeController.delete);

export default routes;
