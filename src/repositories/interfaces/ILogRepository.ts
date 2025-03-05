import { Log } from '../../entities/Log';

// Interface for the Log Repository
export interface ILogRepository {
  /**
   * Saves a log entry to the storage or backend.
   * @param log - The log entry to save
   * @returns Promise<void>
   */
  saveLog(log: Log): Promise<void>;

  /**
   * Retrieves all log entries from the storage or backend.
   * @returns Promise<Log[]> - Array of log entries
   */
  fetchLogs(): Promise<Log[]>;
}