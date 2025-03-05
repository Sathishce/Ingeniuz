import * as SecureStore from 'expo-secure-store';

// Interface for storage options
interface StorageOptions {
  keychainAccessible?: SecureStore.SecureStoreOptions['keychainAccessible'];
}

export class StorageService {
  async setItem<T>(key: string, value: T, options?: StorageOptions): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await SecureStore.setItemAsync(key, stringValue, options);
    } catch (error) {
      console.error(`Failed to set item for key "${key}":`, error);
      throw new Error(`StorageService: Failed to set item: ${(error as Error).message}`);
    }
  }

  async getItem<T>(key: string, options?: StorageOptions): Promise<T | null> {
    try {
      const value = await SecureStore.getItemAsync(key, options);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Failed to get item for key "${key}":`, error);
      throw new Error(`StorageService: Failed to get item: ${(error as Error).message}`);
    }
  }

  async deleteItem(key: string, options?: StorageOptions): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key, options);
    } catch (error) {
      console.error(`Failed to delete item for key "${key}":`, error);
      throw new Error(`StorageService: Failed to delete item: ${(error as Error).message}`);
    }
  }

  async storeLessonPoints(lessonId: string, questionCount: number, points: number): Promise<void> {
    points = (100 / questionCount) * points;
    try {
      const userEmail = await this.getCurrentUserEmail();
      if (!userEmail || userEmail.trim() === '') {
        return;
      }

      const storedData = await this.getItem<Record<string, Record<string, number>>>('lessonPoints');
      let lessonPoints = storedData || {};

      if (!lessonPoints.hasOwnProperty(userEmail)) {
        lessonPoints[userEmail] = {};
      }

      lessonPoints[userEmail][lessonId] = points;
      await this.setItem('lessonPoints', lessonPoints);
      await this.getSumOfLessonPoints(userEmail);
    } catch (error) {
      console.error('Error storing lesson points:', error);
      throw error;
    }
  }

  async getAllLessonPoints(userEmail: string): Promise<Record<string, number>> {
    try {
      if (!userEmail || userEmail.trim() === '') {
        return {};
      }

      const storedData = await this.getItem<Record<string, Record<string, number>>>('lessonPoints');
      if (storedData) {
        return storedData[userEmail] || {};
      }
      return {};
    } catch (error) {
      console.error('Error retrieving all lesson points:', error);
      throw error;
    }
  }

  async getSumOfLessonPoints(userEmail?: string): Promise<number> {
    const email = userEmail || (await this.getCurrentUserEmail());
    if (!email || email.trim() === '') {
      return 0;
    }

    try {
      const storedData = await this.getItem<Record<string, Record<string, number>>>('lessonPoints');
      if (storedData && storedData.hasOwnProperty(email)) {
        const userLessonPoints = storedData[email];
        return Object.values(userLessonPoints).reduce((acc, val) => acc + (val as number), 0);
      }
      return 0;
    } catch (error) {
      console.error('Error retrieving sum of lesson points:', error);
      throw error;
    }
  }

  async saveCurrentUserEmail(userEmail: string): Promise<void> {
    try {
      if (!userEmail || userEmail.trim() === '') {
        throw new Error('User email is undefined or empty');
      }
      await this.setItem('userEmail', userEmail);
    } catch (error) {
      console.error('Error storing user email:', error);
      throw error;
    }
  }

  async saveCurrentUserName(userName: string): Promise<void> {
    try {
      if (!userName || userName.trim() === '') {
        throw new Error('User name is undefined or empty');
      }
      await this.setItem('userName', userName);
      console.log('User name saved:', userName);
    } catch (error) {
      console.error('Error storing user name:', error);
      throw error;
    }
  }

  async getCurrentUserEmail(): Promise<string | null> {
    try {
      return await this.getItem<string>('userEmail');
    } catch (error) {
      console.error('Error retrieving user email:', error);
      throw error;
    }
  }

  async getUserName(): Promise<string | null> {
    try {
      return await this.getItem<string>('userName');
    } catch (error) {
      console.error('Error retrieving user name:', error);
      throw error;
    }
  }
}

// Singleton instance
export const storageService = new StorageService();

// Utility functions using the singleton
export const setItem = <T>(key: string, value: T, options?: StorageOptions) =>
  storageService.setItem(key, value, options);

export const getItem = <T>(key: string, options?: StorageOptions) =>
  storageService.getItem<T>(key, options);

export const deleteItem = (key: string, options?: StorageOptions) =>
  storageService.deleteItem(key, options);

export const storeLessonPoints = (lessonId: string, questionCount: number, points: number) =>
  storageService.storeLessonPoints(lessonId, questionCount, points);

export const getAllLessonPoints = (userEmail: string) =>
  storageService.getAllLessonPoints(userEmail);

export const getSumOfLessonPoints = (userEmail?: string) =>
  storageService.getSumOfLessonPoints(userEmail);

export const saveCurrentUserEmail = (userEmail: string) =>
  storageService.saveCurrentUserEmail(userEmail);

export const saveCurrentUserName = (userName: string) =>
  storageService.saveCurrentUserName(userName);

export const getCurrentUserEmail = () => storageService.getCurrentUserEmail();

export const getUserName = () => storageService.getUserName();