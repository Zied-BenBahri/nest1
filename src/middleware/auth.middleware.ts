import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['auth-user'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
      // Décoder le token avec une clé secrète (remplacez "SECRET_KEY" par votre clé réelle)
      const decoded = verify(authHeader as string, 'SECRET_KEY');
      const userId = decoded['userId'];
/*
      if (!userId) {
        return res.status(401).json({ message: 'Invalid token: userId not found' });
      }*/

      // Injecter userId dans la requête pour une utilisation ultérieure
      req['userId'] = userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  }
}
