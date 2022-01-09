import Joi from 'joi';
import HttpRequest from './HttpRequest';
// import IRequest from '../types/IRequest';

class LoginRequest extends HttpRequest {
  public schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  });
}

export default LoginRequest;
