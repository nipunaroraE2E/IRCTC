import { getConnection } from '../config/database'; // Assuming you have a database.ts file for the MySQL connection
import { RowDataPacket } from 'mysql2';

export interface Train {
  id?: number;
  trainName: string;
  source: string;
  destination: string;
  totalSeats: number;
  availableSeats: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Function to create a new train
export const createTrain = async (train: Train): Promise<void> => {
  const connection = await getConnection();
  const query = `
    INSERT INTO Train (trainName, source, destination, totalSeats, availableSeats)
    VALUES (?, ?, ?, ?, ?)
  `;
  await connection.execute(query, [train.trainName, train.source, train.destination, train.totalSeats, train.availableSeats]);
  connection.release();
};

// Function to fetch all trains
export const getAllTrains = async (): Promise<Train[]> => {
  const connection = await getConnection();
  const query = `SELECT * FROM Train`;
  const [rows]: [RowDataPacket[], any] = await connection.execute(query);
  connection.release();
  return rows as Train[];
};

// Function to get a train by ID
export const getTrainById = async (id: number): Promise<Train | null> => {
  const connection = await getConnection();
  const query = `SELECT * FROM Train WHERE id = ?`;
  const [rows]: [RowDataPacket[], any] = await connection.execute(query, [id]);
  connection.release();
  return rows.length > 0 ? (rows[0] as Train) : null;
};

// Function to update a train's seat availability
export const updateTrainSeats = async (id: number, availableSeats: number): Promise<void> => {
  const connection = await getConnection();
  const query = `
    UPDATE Train SET availableSeats = ? WHERE id = ?
  `;
  await connection.execute(query, [availableSeats, id]);
  connection.release();
};

// Function to delete a train by ID
export const deleteTrain = async (id: number): Promise<void> => {
  const connection = await getConnection();
  const query = `DELETE FROM Train WHERE id = ?`;
  await connection.execute(query, [id]);
  connection.release();
};
