import Joi from 'joi';
import HttpRequest from './HttpRequest';
import IRequest from '../types/IRequest';

export interface IUpdateProfileRequestData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class UpdateProfileRequest extends HttpRequest implements IRequest {
  public schema = Joi.object<IUpdateProfileRequestData>({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional().min(8),
  });
}

export default UpdateProfileRequest;
