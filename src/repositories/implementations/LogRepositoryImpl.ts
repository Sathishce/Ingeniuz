import { ILogRepository } from '../interfaces/ILogRepository';
import { Log } from '../../entities/Log';
import * as SecureStore from 'expo-secure-store';

// Key for storing logs in SecureStore
const LOG_STORAGE_KEY = 'app_logs';

export class LogRepositoryImpl implements ILogRepository {
  /**
   * Saves a log entry by appending it to the existing logs in SecureStore.
   * @param log - The log entry to save
   */
  async saveLog(log: Log): Promise<void> {
    try {
      // Fetch existing logs
      const existingLogs = await this.fetchLogs();
      
      // Add new log (generate an ID if not provided)
      const logWithId = { ...log, id: log.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
      const updatedLogs = [...existingLogs, logWithId];

      // Save back to SecureStore
      await SecureStore.setItemAsync(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
      console.log(`[${log.level}] ${log.message}`, log.context); // Optional: Log to console
    } catch (error) {
      console.error('Failed to save log:', error);
      throw new Error(`Failed to save log: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieves all log entries from SecureStore.
   * @returns Array of log entries
   */
  async fetchLogs(): Promise<Log[]> {
    try {
      const logsJson = await SecureStore.getItemAsync(LOG_STORAGE_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw new Error(`Failed to fetch logs: ${(error as Error).message}`);
    }
  }
}