import "reflect-metadata";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./database";

import routes from "./routes";

dotenv.config();

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
