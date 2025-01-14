import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export async function createConnection() {
  return await mysql.createConnection({
    host: 'mysql-pledgeandgrow.alwaysdata.net',
    port: 3306,
    user: '394321',
    password: 'Lppqcqplo95!',
    database: 'pledgeandgrow_cabinet-michou'
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
