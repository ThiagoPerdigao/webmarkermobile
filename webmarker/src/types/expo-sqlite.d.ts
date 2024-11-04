declare module 'expo-sqlite' {
  interface SQLiteDatabase {
    execAsync(sql: string): Promise<void>;
    runAsync(sql: string, ...args: any[]): Promise<{ lastInsertRowId: number; changes: number }>;
    getAllAsync(sql: string, ...args: any[]): Promise<any[]>;
    getFirstAsync(sql: string, ...args: any[]): Promise<any>;
  }

  export function openDatabaseAsync(
    name: string,
    version?: string,
    description?: string,
    size?: number
  ): Promise<SQLiteDatabase>;
}
