// userModel.ts
import { getConnection } from "../config/database";
import { RowDataPacket } from 'mysql2';

export interface User {
  id: number;
  Email: string;
  password: string; // This will be hashed
}

export const createUser = async (Email: string, password: string): Promise<void> => {
  const connection = await getConnection();
  const query = 'INSERT INTO users (Email, password) VALUES (?, ?)';
  await connection.execute(query, [Email, password]);
  connection.release();
};

export const findUserByEmail = async (Email: string): Promise<User | null> => {
  const connection = await getConnection();
  const query = 'SELECT * FROM users WHERE email = ?';
 // Use correct typing for the result
 const [rows]: [RowDataPacket[], any] = await connection.execute(query, [Email]);
 connection.release();

  // Check if rows exist and return the first user found or null
  return rows.length > 0 ? (rows[0] as User) : null; 
};

