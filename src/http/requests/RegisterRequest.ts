import Joi from 'joi';
import HttpRequest from './HttpRequest';
import IRequest from '../types/IRequest';

export interface IRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class RegisterRequest extends HttpRequest implements IRequest {
  public schema = Joi.object<IRegisterData>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  });
}

export default RegisterRequest;
