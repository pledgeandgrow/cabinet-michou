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

export async function getAllActualites() {
  const results = await query<RowDataPacket[]>({
    query: "SELECT * FROM actualites ORDER BY id DESC",
  })
  return results
}

export async function insertActualite(titre: string, contenu: string, lien: string, publie: boolean) {
  const results = await query<RowDataPacket[]>({
    query: "INSERT INTO actualites (titre, contenu, lien, publie) VALUES (?, ?, ?, ?)",
    values: [titre, contenu, lien, publie]
  });
  return results;
}

export async function updateActualite(
  id: number,
  titre: string,
  contenu: string,
  lien: string,
  publie: boolean
) {
  const results = await query<RowDataPacket[]>({
    query:
      'UPDATE actualites SET titre = ?, contenu = ?, lien = ?, publie = ? WHERE id = ?',
    values: [titre, contenu, lien, publie, id],
  });
  return results;
}


export async function deleteActualite(id: number) {
  const results = await query<RowDataPacket[]>({
    query: "DELETE FROM actualites WHERE id = ?",
    values: [id]
  });
  return results;
}


