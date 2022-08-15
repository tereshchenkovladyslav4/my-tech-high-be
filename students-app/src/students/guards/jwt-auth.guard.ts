import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
  
  @Injectable()
  export class JWTAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        
      const ctx = context.switchToHttp().getRequest();
      //console.log(ctx);
      //console.log(ctx.headers);
      if (!ctx.headers.authorization) {
        return false;
      }
      ctx.user = await this.validateToken(ctx.headers.authorization);
       return true;
    }
  
    async validateToken(auth: string) {
      if (auth.split(' ')[0] !== 'Bearer') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const token = auth.split(' ')[1];
  
      try {
        const decoded = jwt.verify(token, 'info_center-v_2.0');
        return decoded;
      } catch (err) {
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.UNAUTHORIZED);
      }
    }
  }