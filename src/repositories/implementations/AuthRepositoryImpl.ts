import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User } from '../../entities/User';
import { apolloClient } from '../../services/ApolloService';
import { LogRepositoryImpl } from './LogRepositoryImpl';
import { LogLevel } from '../../entities/Log';
import {
  LOGIN_USER,
  REGISTER_USER,
  COMPLETE_TWO_FACTOR,
  IS_FIRST_USER,
} from '../../services/ApolloService';

const logRepository = new LogRepositoryImpl();

export class AuthRepositoryImpl implements IAuthRepository {
  private async log(level: LogLevel, message: string, userId?: string, context?: any) {
    await logRepository.saveLog({ timestamp: new Date().toISOString(), level, message, userId, context });
  }

  async login(email: string, password: string): Promise<boolean> {
    await this.log(LogLevel.INFO, `Login attempt for email: ${email}`, undefined, { action: 'login' });
    try {
      const result = await apolloClient.mutate({
        mutation: LOGIN_USER,
        variables: { email, password },
      });
      if (!result.data?.login?.success) throw new Error('Login failed');
      await this.log(LogLevel.INFO, `Login successful for email: ${email}, MFA required: ${result.data.login.requiresMFA}`);
      return result.data.login.requiresMFA || false;
    } catch (error) {
      await this.log(LogLevel.ERROR, `Login failed for email: ${email}`, undefined, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async register(username: string, email: string, phone: string): Promise<void> {
    await this.log(LogLevel.INFO, `Register attempt for email: ${email}`, undefined, { action: 'register' });
    const result = await apolloClient.mutate({
      mutation: REGISTER_USER,
      variables: { username, email, phone },
    });
    if (!result.data?.register?.id) throw new Error('Registration failed');
    await this.log(LogLevel.INFO, `Registration successful for email: ${email}`);
  }

  async completeTwoFactor(email: string, emailOtp: string, smsOtp: string): Promise<User> {
    await this.log(LogLevel.INFO, `2FA attempt for email: ${email}`, undefined, { action: 'completeTwoFactor' });
    const result = await apolloClient.mutate({
      mutation: COMPLETE_TWO_FACTOR,
      variables: { email, emailOtp, smsOtp },
    });
    const { token, username } = result.data.completeTwoFactor;
    if (!token || !username) throw new Error('Incomplete 2FA response');
    await this.log(LogLevel.INFO, `2FA completed for email: ${email}`);
    return { email, username, token };
  }

  async isFirstUser(email: string): Promise<boolean> {
    await this.log(LogLevel.DEBUG, `Checking if first user for email: ${email}`);
    const result = await apolloClient.query({
      query: IS_FIRST_USER,
      variables: { email },
      fetchPolicy: 'network-only',
    });
    return result.data.getIsFirstLogin ?? false;
  }
}