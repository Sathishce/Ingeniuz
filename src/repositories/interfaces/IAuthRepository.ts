import { User } from "../../entities/User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<boolean>;
  register(username: string, email: string, phone: string): Promise<void>;
  completeTwoFactor(email: string, emailOtp: string, smsOtp: string): Promise<User>;
  isFirstUser(email: string): Promise<boolean>;
}