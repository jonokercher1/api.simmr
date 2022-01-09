import Joi, { ValidationResult } from 'joi';

interface IRequest {
  schema: Joi.Schema;
  validate(data: any): ValidationResult<any>;
}

export default IRequest;
