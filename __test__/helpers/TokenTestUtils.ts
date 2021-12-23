import jwt from 'jsonwebtoken';

export default class TokenTestUtils {
  public static async generateToken(subject: string, expiresIn: number | string = 3600000): Promise<string> {
    return jwt.sign({}, 'secret', { subject, expiresIn });
  }
}
