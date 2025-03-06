import { ICognitoAuthRepository } from '../interfaces/ICognitoAuthRepository';
import { User } from '../../entities/User';


export class CognitoAuthRepositoryImpl implements ICognitoAuthRepository {
    login(email: string, password: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    register(username: string, email: string, phone: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    completeTwoFactor(email: string, emailOtp: string, smsOtp: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
    isFirstUser(email: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}