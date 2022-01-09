import Joi, { ValidationResult } from 'joi';
import IRequest from '../types/IRequest';

export default abstract class HttpRequest implements IRequest {
  public schema: Joi.Schema;

  public validate(data: any): ValidationResult<any> {
    return this.schema.validate(data, { abortEarly: false });
  }
}
