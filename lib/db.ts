import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export async function createConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'cabinet_michou_db'
  });
}

export async function query<T extends RowDataPacket[]>({ 
  query, 
  values = [] 
}: { 
  query: string; 
  values?: any[] 
}): Promise<T> {
  const connection = await createConnection();
  try {
    const [results] = await connection.execute<T>(query, values);
    return results;
  } finally {
    connection.end();
  }
}
