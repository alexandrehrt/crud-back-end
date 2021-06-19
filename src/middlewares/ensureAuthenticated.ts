import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void | Response {
  const authHeader = request.headers.authorization;

  if (!authHeader) return response.status(400).send("Token is missing");

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    const { sub } = decoded as ITokenPayload;

    request.user = { id: sub };

    return next();
  } catch {
    return response.status(400).json({ error: "Token inválido" });
  }
}
