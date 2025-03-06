import { User } from '../../entities/User';

export interface ICognitoAuthRepository {
  /**
   * Initiates login with email and password, returns true if MFA is required.
   */
  login(email: string, password: string): Promise<boolean>;

  /**
   * Registers a new user with username, email, and phone.
   */
  register(username: string, email: string, phone: string): Promise<void>;

  /**
   * Completes MFA with email and OTP codes, returns authenticated user.
   */
  completeTwoFactor(email: string, emailOtp: string, smsOtp: string): Promise<User>;

  /**
   * Checks if the user is logging in for the first time.
   */
  isFirstUser(email: string): Promise<boolean>;
}
