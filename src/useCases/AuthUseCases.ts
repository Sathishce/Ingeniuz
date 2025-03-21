import { IAuthRepository } from "../repositories/interfaces/IAuthRepository";
import { ILogRepository } from "../repositories/interfaces/ILogRepository";
import { User } from "../entities/User";
import { LogLevel } from "../entities/Log";
import { storageService } from "../services/StorageService";

export class AuthUseCases {
  constructor(
    private authRepository: IAuthRepository,
    private logRepository: ILogRepository
  ) {}

  /**
   * Login user with email and password.
   * @param email User's email address
   * @param password User's password
   * @returns Promise that resolves to true if the user needs to complete 2FA, false otherwise
   */
  async login(email: string, password: string): Promise<boolean> {
    await this.logRepository.saveLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: `Login attempt for email: ${email}`,
      context: { action: "login" },
    });
    try {
      const requiresMFA = await this.authRepository.login(email, password);
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        message: `Login successful for email: ${email}, MFA required: ${requiresMFA}`,
      });
      return requiresMFA; // Return true to trigger MFA step
    } catch (error) {
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        message: `Login failed for email: ${email}`,
        context: { error: (error as Error).message },
      });
      throw error;
    }
  }

  /**
   * Registers a new user.
   * @param username Username chosen by the user
   * @param email User's email address
   * @param phone User's phone number
   * @throws Error if registration fails
   */
  async register(username: string, email: string, phone: string): Promise<void> {
    await this.logRepository.saveLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: `Register attempt for email: ${email}`,
      context: { action: "register" },
    });
    try {
      await this.authRepository.register(username, email, phone);
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        message: `Registration successful for email: ${email}`,
      });
    } catch (error) {
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        message: `Registration failed for email: ${email}`,
        context: { error: (error as Error).message },
      });
      throw error;
    }
  }

  /**
   * Completes 2FA for a user.
   * @param email User's email address
   * @param emailOtp The one-time password sent to the user's email
   * @param smsOtp The one-time password sent to the user's phone
   * @returns The user object with a valid token if the 2FA is successful, or throws an error if the 2FA fails
   */
  async completeTwoFactor(email: string, emailOtp: string, smsOtp: string): Promise<User> {
    await this.logRepository.saveLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message: `2FA attempt for email: ${email}`,
      context: { action: "completeTwoFactor" },
    });
    try {
      const user = await this.authRepository.completeTwoFactor(email, emailOtp, smsOtp);
      await storageService.setItem(`token_${email}`, user.token!);
      await storageService.setItem("username", user.username);
      await storageService.setItem("current_email", email);
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        message: `2FA completed successfully for email: ${email}`,
      });
      return user;
    } catch (error) {
      await this.logRepository.saveLog({
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        message: `2FA failed for email: ${email}`,
        context: { error: (error as Error).message },
      });
      throw error;
    }
  }

  /**
   * Checks if the user with the given email is the first user.
   * @param email User's email address
   * @returns True if the user is the first user, false otherwise
   */
  async isFirstUser(email: string): Promise<boolean> {
    await this.logRepository.saveLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message: `Checking if first user for email: ${email}`,
    });
    return await this.authRepository.isFirstUser(email);
  }
}
