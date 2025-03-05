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

  /**
   * Attempts to log in a user with the provided email and password.
   * Logs the attempt and outcome of the login process.
   * 
   * @param email - The email address of the user attempting to log in.
   * @param password - The password associated with the user's email.
   * @returns A promise that resolves to a boolean indicating whether multi-factor authentication (MFA) is required.
   * @throws An error if the login attempt fails.
   */

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

  /**
   * Registers a new user with the provided username, email, and phone number.
   * Logs the registration attempt and outcome.
   *
   * @param username - The username for the new user.
   * @param email - The email address of the new user.
   * @param phone - The phone number of the new user.
   * @returns A promise that resolves when the registration is complete.
   * @throws An error if the registration attempt fails.
   */

  async register(username: string, email: string, phone: string): Promise<void> {
    await this.log(LogLevel.INFO, `Register attempt for email: ${email}`, undefined, { action: 'register' });
    const result = await apolloClient.mutate({
      mutation: REGISTER_USER,
      variables: { username, email, phone },
    });
    if (!result.data?.register?.id) throw new Error('Registration failed');
    await this.log(LogLevel.INFO, `Registration successful for email: ${email}`);
  }

  /**
   * Completes the two-factor authentication process for a user who has already attempted to log in.
   * Logs the attempt and outcome of the 2FA process.
   * 
   * @param email - The email address of the user attempting to complete 2FA.
   * @param emailOtp - The one-time password received via email.
   * @param smsOtp - The one-time password received via SMS.
   * @returns A promise that resolves to a `User` object with the user's email, username, and token.
   * @throws An error if the 2FA attempt fails.
   */
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

  /**
   * Queries the server to check if the given email is associated with a new user,
   * i.e. the first user to log in with that email address.
   * Logs the attempt and outcome of the check.
   * @param email - The email address of the user to check.
   * @returns A promise that resolves to true if the email is associated with a new user, false otherwise.
   */
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