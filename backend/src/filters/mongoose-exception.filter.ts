import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch(mongoose.Error)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // ! We can make this more specific if we want
    // ! We can extract mongoose specific error and convert that to HttpException
    // ! Like, CastError, ValidationError etc.
    // ! For more look through: https://mongoosejs.com/docs/api/error.html

    response.status(418).json({
      statusCode: 418,
      message: exception.message,
    });
  }
}
